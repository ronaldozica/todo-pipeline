'use client';

import React, { useEffect, useState } from 'react';
import { CloudOff, Lock, Sparkles, X, LogIn } from 'lucide-react';

interface LoginPromptBannerProps {
  onSignIn: () => void;
  isSupabaseConfigured: boolean;
}

/**
 * Banner persistente e modal de boas-vindas incentivando fortemente o login.
 * Sem login: dados ficam apenas no navegador (localStorage) e podem ser perdidos.
 * Com login: dados sincronizados em nuvem (Supabase) entre PC e celular.
 */
export const LoginPromptBanner: React.FC<LoginPromptBannerProps> = ({
  onSignIn,
  isSupabaseConfigured,
}) => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    // Mostrar modal de boas-vindas na primeira visita
    const hasSeenWelcome = localStorage.getItem('todo_pipeline_seen_welcome');
    if (!hasSeenWelcome) {
      // Pequeno delay para o app carregar primeiro
      const timer = setTimeout(() => setShowWelcomeModal(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismissModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('todo_pipeline_seen_welcome', '1');
  };

  const handleSignIn = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('todo_pipeline_seen_welcome', '1');
    onSignIn();
  };

  return (
    <>
      {/* Banner fixo no topo (exibido sempre que não há login) */}
      {!bannerDismissed && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 px-4 md:px-6 py-2.5">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <CloudOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                <strong>Modo Offline:</strong> Suas tarefas estão salvas apenas neste navegador.{' '}
                <strong>Se limpar o cache ou trocar de dispositivo, perderá tudo.</strong>
                {isSupabaseConfigured && (
                  <> Faça login para salvar na nuvem gratuitamente.</>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isSupabaseConfigured && (
                <button
                  onClick={handleSignIn}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Entrar com Google
                </button>
              )}
              <button
                onClick={() => setBannerDismissed(true)}
                className="p-1.5 text-amber-500 hover:text-amber-800 dark:hover:text-amber-200 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition"
                title="Dispensar aviso (dados continuam apenas locais)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Boas-Vindas (aparece na primeira visita) */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Gradiente decorativo */}
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-3">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Bem-vindo ao Todo Pipeline!
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Seu gerenciador de tarefas estilo CI/CD.
                </p>
              </div>

              {/* Comparativo: com/sem login */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Sem login */}
                <div className="p-3 rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 mb-2">
                    <CloudOff className="w-3.5 h-3.5" />
                    Sem Login
                  </div>
                  <ul className="space-y-1 text-amber-700 dark:text-amber-400">
                    <li>⚠️ Dados só neste browser</li>
                    <li>⚠️ Perde ao limpar cache</li>
                    <li>⚠️ Sem acesso no celular</li>
                    <li>⚠️ Sem backup automático</li>
                  </ul>
                </div>
                {/* Com login */}
                <div className="p-3 rounded-xl border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                    <Lock className="w-3.5 h-3.5" />
                    Com Login Google
                  </div>
                  <ul className="space-y-1 text-emerald-700 dark:text-emerald-400">
                    <li>✅ Dados na nuvem (grátis)</li>
                    <li>✅ Acesso em qualquer lugar</li>
                    <li>✅ PC e celular sincronizados</li>
                    <li>✅ Backup automático</li>
                  </ul>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-col gap-2.5">
                {isSupabaseConfigured ? (
                  <button
                    onClick={handleSignIn}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2.5 shadow-md transition"
                  >
                    {/* Ícone do Google SVG inline */}
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.53z"/>
                    </svg>
                    Entrar com Google — Gratuito e Seguro
                  </button>
                ) : (
                  <div className="w-full py-3 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-sm text-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
                    Login disponível após configurar o Supabase no painel.
                  </div>
                )}

                <button
                  onClick={handleDismissModal}
                  className="w-full py-2 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
                >
                  Continuar sem login (dados somente locais)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
