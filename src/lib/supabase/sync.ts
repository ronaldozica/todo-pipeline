import { SupabaseClient } from '@supabase/supabase-js';
import { Card, Pipeline, Stage } from '@/types/pipeline';
import { DEFAULT_STAGE_TEMPLATES } from '@/lib/storage/mockData';

/**
 * Serviço de sincronização com o Supabase (PostgreSQL)
 * Faz o mapeamento entre os tipos TypeScript e o schema do banco
 */

export async function fetchUserData(supabase: SupabaseClient, userId: string) {
  try {
    // 1. Buscar pipelines do usuário
    const { data: pipelinesData, error: pipeError } = await supabase
      .from('pipelines')
      .select('*, stages(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (pipeError) {
      console.error('Erro ao buscar pipelines:', pipeError);
      return null;
    }

    // Se o usuário ainda não tiver pipelines no banco, cria o inicial
    if (!pipelinesData || pipelinesData.length === 0) {
      return await initializeDefaultUserPipeline(supabase, userId);
    }

    // Formatar pipelines e stages
    const pipelines: Pipeline[] = pipelinesData.map((p: any) => ({
      id: p.id,
      userId: p.user_id,
      name: p.name,
      description: p.description,
      isDefault: p.is_default,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      stages: (p.stages || [])
        .map((s: any) => ({
          id: s.id,
          pipelineId: s.pipeline_id,
          name: s.name,
          order: s.order,
          color: s.color,
          isBlocked: s.is_blocked,
          isCompleted: s.is_completed,
        }))
        .sort((a: Stage, b: Stage) => a.order - b.order),
    }));

    // 2. Buscar cards do usuário
    const { data: cardsData, error: cardError } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', userId)
      .order('order', { ascending: true });

    if (cardError) {
      console.error('Erro ao buscar cards:', cardError);
      return { pipelines, cards: [] };
    }

    const cards: Card[] = (cardsData || []).map((c: any) => ({
      id: c.id,
      userId: c.user_id,
      pipelineId: c.pipeline_id,
      stageId: c.stage_id,
      title: c.title,
      description: c.description || undefined,
      priority: c.priority,
      difficulty: Number(c.difficulty) as any,
      link: c.link || undefined,
      dueDate: c.due_date || undefined,
      blockedReason: c.blocked_reason || undefined,
      order: c.order,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }));

    return { pipelines, cards };
  } catch (err) {
    console.error('Erro inesperado na sincronização:', err);
    return null;
  }
}

/**
 * Cria o pipeline inicial ("Trabalho") com etapas padrão para o usuário novo
 */
export async function initializeDefaultUserPipeline(supabase: SupabaseClient, userId: string) {
  const pipeId = crypto.randomUUID();
  const now = new Date().toISOString();

  // Criar pipeline
  const { error: pipeError } = await supabase.from('pipelines').insert({
    id: pipeId,
    user_id: userId,
    name: 'Trabalho',
    description: 'Pipeline principal sincronizado na nuvem',
    is_default: true,
    created_at: now,
    updated_at: now,
  });

  if (pipeError) {
    console.error('Erro ao criar pipeline inicial:', pipeError);
    return null;
  }

  // Criar stages
  const stageInserts = DEFAULT_STAGE_TEMPLATES.map((tpl, idx) => ({
    id: crypto.randomUUID(),
    pipeline_id: pipeId,
    name: tpl.name,
    order: idx,
    color: tpl.color,
    is_blocked: tpl.isBlocked,
    is_completed: tpl.isCompleted,
    created_at: now,
  }));

  const { data: createdStages, error: stagesError } = await supabase
    .from('stages')
    .insert(stageInserts)
    .select();

  if (stagesError) {
    console.error('Erro ao criar etapas padrão:', stagesError);
    return null;
  }

  const pipeline: Pipeline = {
    id: pipeId,
    userId,
    name: 'Trabalho',
    description: 'Pipeline principal sincronizado na nuvem',
    isDefault: true,
    stages: (createdStages || []).map((s: any) => ({
      id: s.id,
      pipelineId: s.pipeline_id,
      name: s.name,
      order: s.order,
      color: s.color,
      isBlocked: s.is_blocked,
      isCompleted: s.is_completed,
    })),
    createdAt: now,
    updatedAt: now,
  };

  return { pipelines: [pipeline], cards: [] };
}

/**
 * Salva ou atualiza um card no Supabase
 */
export async function upsertCardToSupabase(supabase: SupabaseClient, card: Card, userId: string) {
  try {
    const payload = {
      id: card.id,
      user_id: userId,
      pipeline_id: card.pipelineId,
      stage_id: card.stageId,
      title: card.title,
      description: card.description || null,
      priority: card.priority,
      difficulty: card.difficulty,
      link: card.link || null,
      due_date: card.dueDate || null,
      blocked_reason: card.blockedReason || null,
      order: card.order,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('cards').upsert(payload);
    if (error) console.error('Erro ao persistir card no Supabase:', error);
  } catch (err) {
    console.error('Erro ao enviar card:', err);
  }
}

/**
 * Remove um card no Supabase
 */
export async function deleteCardFromSupabase(supabase: SupabaseClient, cardId: string) {
  try {
    await supabase.from('cards').delete().eq('id', cardId);
  } catch (err) {
    console.error('Erro ao excluir card no Supabase:', err);
  }
}
