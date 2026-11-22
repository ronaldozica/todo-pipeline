'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Pipeline, Card } from '@/types/pipeline';
import { INITIAL_PIPELINES, INITIAL_CARDS, DEFAULT_STAGE_TEMPLATES } from '@/lib/storage/mockData';
import { Navbar } from '@/components/layout/Navbar';
import { createClient } from '@/lib/supabase/client';
import { fetchUserData, upsertCardToSupabase } from '@/lib/supabase/sync';
import { LoginPromptBanner } from '@/components/ui/LoginPromptBanner';

// Carregamento dinâmico sem SSR para componentes interativos de drag-and-drop
const PipelineBoard = dynamic(
  () => import('@/components/pipeline/PipelineBoard').then((mod) => mod.PipelineBoard),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center p-8 text-zinc-400 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <span>Carregando pipeline...</span>
        </div>
      </div>
    ),
  }
);

const STORAGE_PIPELINES_KEY = 'todo_pipeline_pipelines_v1';
const STORAGE_CARDS_KEY = 'todo_pipeline_cards_v1';

export default function Home() {
  const [pipelines, setPipelines] = useState<Pipeline[]>(INITIAL_PIPELINES);
  const [activePipelineId, setActivePipelineId] = useState<string>(INITIAL_PIPELINES[0].id);
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [user, setUser] = useState<{ email?: string; name?: string; avatarUrl?: string } | null>(null);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  // Inicialização do estado local / Supabase
  useEffect(() => {
    // 1. Tentar carregar do LocalStorage primeiro para resposta imediata
    try {
      const savedPipelines = localStorage.getItem(STORAGE_PIPELINES_KEY);
      const savedCards = localStorage.getItem(STORAGE_CARDS_KEY);

      if (savedPipelines) {
        const parsed = JSON.parse(savedPipelines);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPipelines(parsed);
          setActivePipelineId(parsed[0].id);
        }
      }

      if (savedCards) {
        const parsedCards = JSON.parse(savedCards);
        if (Array.isArray(parsedCards)) {
          setCards(parsedCards);
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar dados do LocalStorage:', e);
    }

    // 2. Checar conexão com Supabase
    const supabase = createClient();
    if (supabase) {
      setIsSupabaseConfigured(true);

      const loadUserCloudData = async (uid: string) => {
        setUserId(uid);
        const cloudData = await fetchUserData(supabase, uid);
        if (cloudData && cloudData.pipelines.length > 0) {
          setPipelines(cloudData.pipelines);
          setActivePipelineId(cloudData.pipelines[0].id);
          setCards(cloudData.cards);
        }
      };

      // Obter usuário logado atual
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setUser({
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split('@')[0],
            avatarUrl: user.user_metadata?.avatar_url,
          });
          loadUserCloudData(user.id);
        }
      });

      // Escutar mudanças de autenticação
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            avatarUrl: session.user.user_metadata?.avatar_url,
          });
          loadUserCloudData(session.user.id);
        } else {
          setUser(null);
          setUserId(null);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }

    setIsLoaded(true);
  }, []);

  // Salvar no LocalStorage e no Supabase sempre que houver alteração
  const handleUpdateCards = (newCards: Card[]) => {
    setCards(newCards);
    try {
      localStorage.setItem(STORAGE_CARDS_KEY, JSON.stringify(newCards));
    } catch (e) {
      console.error('Erro ao salvar cards no LocalStorage:', e);
    }

    // Sincronizar com Supabase se estiver conectado e logado
    if (userId) {
      const supabase = createClient();
      if (supabase) {
        // Encontra cards que foram criados/modificados para sincronizar
        newCards.forEach((card) => {
          upsertCardToSupabase(supabase, card, userId);
        });
      }
    }
  };

  const handleUpdatePipelines = (newPipelines: Pipeline[]) => {
    setPipelines(newPipelines);
    try {
      localStorage.setItem(STORAGE_PIPELINES_KEY, JSON.stringify(newPipelines));
    } catch (e) {
      console.error('Erro ao salvar pipelines no LocalStorage:', e);
    }
  };

  // Criar um novo pipeline com as etapas padrão configuradas
  const handleAddPipeline = (name: string, description?: string) => {
    const pipelineId = `pipe-${Date.now()}`;
    const now = new Date().toISOString();

    const stages = DEFAULT_STAGE_TEMPLATES.map((tpl, idx) => ({
      id: `stage-${pipelineId}-${idx}`,
      pipelineId,
      name: tpl.name,
      order: idx,
      color: tpl.color,
      isBlocked: tpl.isBlocked,
      isCompleted: tpl.isCompleted,
    }));

    const newPipeline: Pipeline = {
      id: pipelineId,
      name,
      description,
      isDefault: false,
      stages,
      createdAt: now,
      updatedAt: now,
    };

    const updatedPipelines = [...pipelines, newPipeline];
    handleUpdatePipelines(updatedPipelines);
    setActivePipelineId(pipelineId);
  };

  // Autenticação com Google via Supabase OAuth
  const handleSignInWithGoogle = async () => {
    const supabase = createClient();
    if (!supabase) {
      alert(
        'Para habilitar o Login com Google em nuvem gratuita, configure as chaves do Supabase no arquivo .env.local (veja o arquivo .env.example).'
      );
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });

    if (error) {
      alert(`Erro ao iniciar login com Google: ${error.message}`);
    }
  };

  // Logout
  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const activePipeline =
    pipelines.find((p) => p.id === activePipelineId) || pipelines[0];

  const pipelineCards = cards.filter((c) => c.pipelineId === activePipeline?.id);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Barra de Navegação */}
      <Navbar
        pipelines={pipelines}
        activePipelineId={activePipelineId}
        onSelectPipeline={setActivePipelineId}
        onAddPipeline={handleAddPipeline}
        user={user}
        onSignInWithGoogle={handleSignInWithGoogle}
        onSignOut={handleSignOut}
      />

      {/* Banner de incentivo ao login — aparece quando o usuário não está logado */}
      {!user && (
        <LoginPromptBanner
          onSignIn={handleSignInWithGoogle}
          isSupabaseConfigured={isSupabaseConfigured}
        />
      )}

      {/* Área do Pipeline Board */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8 text-zinc-500 text-sm">Carregando pipeline...</div>}>
          {activePipeline ? (
            <PipelineBoard
              key={activePipeline.id}
              pipeline={activePipeline}
              cards={pipelineCards}
              onUpdateCards={(newPipelineCards) => {
                // Atualiza os cards desse pipeline preservando os cards de outros pipelines
                const otherPipelineCards = cards.filter(
                  (c) => c.pipelineId !== activePipeline.id
                );
                handleUpdateCards([...otherPipelineCards, ...newPipelineCards]);
              }}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-zinc-500">
              Nenhum pipeline encontrado. Crie um novo no seletor acima.
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
}
