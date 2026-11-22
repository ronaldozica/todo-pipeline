'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, Stage } from '@/types/pipeline';
import { PipelineCard } from '@/components/card/PipelineCard';
import { Plus, MoreHorizontal, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PipelineColumnProps {
  stage: Stage;
  stages: Stage[];
  cards: Card[];
  onAddCard: (stageId: string) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (id: string) => void;
  onMoveToStage: (cardId: string, targetStageId: string) => void;
}

export const PipelineColumn: React.FC<PipelineColumnProps> = ({
  stage,
  stages,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onMoveToStage,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
    data: {
      type: 'Stage',
      stage,
    },
  });

  const cardIds = cards.map((c) => c.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-80 shrink-0 bg-zinc-100/80 dark:bg-zinc-900/60 border ${
        isOver
          ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20'
          : 'border-zinc-200 dark:border-zinc-800'
      } rounded-2xl overflow-hidden transition-all duration-150`}
    >
      {/* Barra de destaque superior com cor da etapa (estilo CI/CD pipeline) */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: stage.color }}
      />

      {/* Cabeçalho da Etapa */}
      <div className="p-3.5 pb-2.5 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: stage.color }}
          />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
            {stage.name}
          </h2>

          {/* Badge informativo de Bloqueado / Concluído */}
          {stage.isBlocked && (
            <span title="Etapa de bloqueio: exige justificativa">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            </span>
          )}
          {stage.isCompleted && (
            <span title="Etapa final: comemoração com confetes!">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </span>
          )}

          {/* Contador de Tarefas */}
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            {cards.length}
          </span>
        </div>

        {/* Botão Adicionar Tarefa Rápida */}
        <button
          onClick={() => onAddCard(stage.id)}
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          title={`Adicionar tarefa em ${stage.name}`}
          aria-label={`Adicionar tarefa em ${stage.name}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Lista de Cards da Coluna com Drag and Drop */}
      <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[160px]">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card, idx) => (
            <PipelineCard
              key={card.id}
              card={card}
              index={idx}
              stages={stages}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
              onMoveToStage={onMoveToStage}
            />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div
            onClick={() => onAddCard(stage.id)}
            className="h-28 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center text-xs text-zinc-400 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-400 cursor-pointer transition gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Nenhuma tarefa aqui</span>
          </div>
        )}
      </div>

      {/* Rodapé da Coluna */}
      <div className="p-2.5 pt-0 bg-transparent">
        <button
          onClick={() => onAddCard(stage.id)}
          className="w-full py-2 px-3 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-solid transition flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Adicionar Tarefa
        </button>
      </div>
    </div>
  );
};
