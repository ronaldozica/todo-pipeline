'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, PRIORITY_CONFIG, Stage } from '@/types/pipeline';
import {
  GripVertical,
  ExternalLink,
  Calendar,
  AlertTriangle,
  MoreVertical,
  Edit2,
  Trash2,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

interface PipelineCardProps {
  card: Card;
  index: number;
  stages: Stage[];
  onEdit: (card: Card) => void;
  onDelete: (id: string) => void;
  onMoveToStage: (cardId: string, targetStageId: string) => void;
}

export const PipelineCard: React.FC<PipelineCardProps> = ({
  card,
  index,
  stages,
  onEdit,
  onDelete,
  onMoveToStage,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showMoveSubmenu, setShowMoveSubmenu] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      card,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const priorityInfo = PRIORITY_CONFIG[card.priority] || PRIORITY_CONFIG.MEDIA;

  // Formatador de data simples e seguro contra hydration mismatch
  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const formattedDueDate = formatDueDate(card.dueDate);
  const formattedUpdatedDate = formatDueDate(card.updatedAt);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white dark:bg-zinc-900 border ${
        isDragging
          ? 'border-indigo-500 shadow-2xl opacity-70 scale-105 z-50 ring-2 ring-indigo-500/20'
          : card.blockedReason
          ? 'border-rose-200 dark:border-rose-900/60 shadow-xs hover:border-rose-300'
          : 'border-zinc-200/90 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700'
      } rounded-xl p-3.5 transition-all duration-150 select-none`}
    >
      {/* Top Header: Número/Ordem, Drag Handle e Menu */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
          {/* Alça de Arraste */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition touch-none"
            title="Arrastar card"
            aria-label="Arrastar card"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <span className="font-mono font-semibold text-[11px] text-zinc-500 dark:text-zinc-400">
            #{index + 1}
          </span>
        </div>

        {/* Badges de Prioridade e Story Points */}
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityInfo.badgeClass}`}
            title={`Prioridade: ${priorityInfo.label}`}
          >
            {priorityInfo.label}
          </span>

          <span
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
            title={`${card.difficulty} Story Points`}
          >
            {card.difficulty} pts
          </span>

          {/* Menu Dropdown de Ações */}
          <div className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              aria-label="Opções do card"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => {
                    setShowMenu(false);
                    setShowMoveSubmenu(false);
                  }}
                />
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-40 py-1.5 text-xs">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(card);
                    }}
                    className="w-full px-3 py-2 text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                    Editar Tarefa
                  </button>

                  {/* Submenu Mover para etapa (ótimo para mobile) */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMoveSubmenu((prev) => !prev)}
                      className="w-full px-3 py-2 text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                        Mover para...
                      </span>
                    </button>

                    {showMoveSubmenu && (
                      <div className="bg-zinc-50 dark:bg-zinc-800/80 border-y border-zinc-200 dark:border-zinc-700 py-1">
                        {stages.map((stg) => (
                          <button
                            key={stg.id}
                            disabled={stg.id === card.stageId}
                            onClick={() => {
                              setShowMenu(false);
                              setShowMoveSubmenu(false);
                              onMoveToStage(card.id, stg.id);
                            }}
                            className={`w-full px-5 py-1.5 text-left text-[11px] flex items-center gap-2 ${
                              stg.id === card.stageId
                                ? 'text-zinc-400 cursor-not-allowed italic'
                                : 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                            }`}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: stg.color }}
                            />
                            {stg.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      if (confirm('Deseja excluir esta tarefa?')) {
                        onDelete(card.id);
                      }
                    }}
                    className="w-full px-3 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Título da Tarefa - Clicável para abrir edição */}
      <h3
        onClick={() => onEdit(card)}
        className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition"
      >
        {card.title}
      </h3>

      {/* Descrição curta se houver */}
      {card.description && (
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
          {card.description}
        </p>
      )}

      {/* Alerta de Bloqueio destacado se houver motivo */}
      {card.blockedReason && (
        <div className="mt-2.5 p-2 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-lg flex items-start gap-1.5 text-[11px] text-rose-800 dark:text-rose-200">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
          <span className="leading-tight">
            <strong>Bloqueio:</strong> {card.blockedReason}
          </span>
        </div>
      )}

      {/* Rodapé do Card com Link e Data Limite */}
      <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          {/* Link externo */}
          {card.link && (
            <a
              href={card.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
              title={card.link}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
              <span>Link</span>
            </a>
          )}

          {/* Data limite */}
          {formattedDueDate && (
            <div className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
              <Calendar className="w-3 h-3" />
              <span>{formattedDueDate}</span>
            </div>
          )}
        </div>

        {/* Indicador de última atualização */}
        <div
          className="text-[10px] text-zinc-400 dark:text-zinc-500"
          title={`Atualizado em: ${card.updatedAt}`}
        >
          <Clock className="w-3 h-3 inline mr-0.5" />
          {formattedUpdatedDate}
        </div>
      </div>
    </div>
  );
};
