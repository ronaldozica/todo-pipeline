'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Card, Pipeline, Stage } from '@/types/pipeline';
import { PipelineColumn } from './PipelineColumn';
import { PipelineCard } from '@/components/card/PipelineCard';
import { CardModal } from '@/components/ui/CardModal';
import { BlockedReasonModal } from '@/components/ui/BlockedReasonModal';
import { triggerCompletionConfetti } from '@/lib/confetti';

interface PipelineBoardProps {
  pipeline: Pipeline;
  cards: Card[];
  onUpdateCards: (newCards: Card[]) => void;
  onUpdatePipeline?: (updatedPipeline: Pipeline) => void;
}

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  pipeline,
  cards,
  onUpdateCards,
}) => {
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  // Estados dos modais
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Partial<Card> | null>(null);
  const [targetStageIdForNewCard, setTargetStageIdForNewCard] = useState<string>(
    pipeline.stages[0]?.id || ''
  );

  // Modal de bloqueio
  const [blockedModalOpen, setBlockedModalOpen] = useState(false);
  const [pendingBlockedCard, setPendingBlockedCard] = useState<{
    cardId: string;
    targetStageId: string;
    newOrder: number;
  } | null>(null);

  // Filtro de aba ativa no mobile para rolagem rápida
  const [activeMobileStageId, setActiveMobileStageId] = useState<string>(
    pipeline.stages[0]?.id || ''
  );

  // Sensores configurados para perfeita harmonia entre Desktop e Mobile
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Evita disparar arrasto em cliques normais
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // No celular, 200ms de toque sustentado para arrastar, permitindo scroll suave
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Início do arrasto
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = cards.find((c) => c.id === active.id);
    if (card) {
      setActiveCard(card);
    }
  };

  // Movimento sobre outras colunas / cartões
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === 'Card';
    const isOverACard = over.data.current?.type === 'Card';
    const isOverAStage = over.data.current?.type === 'Stage';

    if (!isActiveACard) return;

    // Arrastando card sobre outro card
    if (isOverACard) {
      const activeCardIndex = cards.findIndex((c) => c.id === activeId);
      const overCardIndex = cards.findIndex((c) => c.id === overId);

      if (cards[activeCardIndex].stageId !== cards[overCardIndex].stageId) {
        const updated = [...cards];
        updated[activeCardIndex] = {
          ...updated[activeCardIndex],
          stageId: cards[overCardIndex].stageId,
          updatedAt: new Date().toISOString(),
        };
        onUpdateCards(arrayMove(updated, activeCardIndex, overCardIndex));
      }
    }

    // Arrastando card diretamente sobre a coluna (área vazia)
    if (isOverAStage) {
      const activeCardIndex = cards.findIndex((c) => c.id === activeId);
      const stageId = overId as string;

      if (cards[activeCardIndex].stageId !== stageId) {
        const updated = [...cards];
        updated[activeCardIndex] = {
          ...updated[activeCardIndex],
          stageId,
          updatedAt: new Date().toISOString(),
        };
        onUpdateCards(arrayMove(updated, activeCardIndex, activeCardIndex));
      }
    }
  };

  // Finalização do arrasto
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const currentCard = cards.find((c) => c.id === activeId);
    if (!currentCard) return;

    // Descobrir qual é a etapa de destino
    let destinationStageId = currentCard.stageId;
    if (over.data.current?.type === 'Stage') {
      destinationStageId = overId;
    } else if (over.data.current?.type === 'Card') {
      const overCard = cards.find((c) => c.id === overId);
      if (overCard) {
        destinationStageId = overCard.stageId;
      }
    }

    const targetStage = pipeline.stages.find((s) => s.id === destinationStageId);

    // Reordenar se for na mesma coluna
    const activeIndex = cards.findIndex((c) => c.id === activeId);
    const overIndex = cards.findIndex((c) => c.id === overId);
    if (activeIndex !== overIndex && overIndex !== -1) {
      onUpdateCards(arrayMove(cards, activeIndex, overIndex));
    }

    // Verificar se caiu na etapa Concluído -> Disparar Confetes!
    if (targetStage?.isCompleted) {
      triggerCompletionConfetti();
    }

    // Verificar se caiu na etapa Bloqueado -> Exigir motivo de bloqueio
    if (targetStage?.isBlocked && !currentCard.blockedReason) {
      setPendingBlockedCard({
        cardId: currentCard.id,
        targetStageId: destinationStageId,
        newOrder: currentCard.order,
      });
      setBlockedModalOpen(true);
    }
  };

  // Confirmação do motivo de bloqueio pelo modal
  const handleConfirmBlockedReason = (reason: string) => {
    if (!pendingBlockedCard) return;

    const updated = cards.map((c) =>
      c.id === pendingBlockedCard.cardId
        ? {
            ...c,
            stageId: pendingBlockedCard.targetStageId,
            blockedReason: reason,
            updatedAt: new Date().toISOString(),
          }
        : c
    );

    onUpdateCards(updated);
    setBlockedModalOpen(false);
    setPendingBlockedCard(null);
  };

  // Cancelamento do bloqueio (reverte para a etapa anterior ou limpa motivo)
  const handleCancelBlocked = () => {
    setBlockedModalOpen(false);
    setPendingBlockedCard(null);
  };

  // Abertura do modal para novo card
  const handleOpenAddCard = (stageId: string) => {
    setSelectedCard(null);
    setTargetStageIdForNewCard(stageId);
    setCardModalOpen(true);
  };

  // Abertura do modal para edição
  const handleOpenEditCard = (card: Card) => {
    setSelectedCard(card);
    setTargetStageIdForNewCard(card.stageId);
    setCardModalOpen(true);
  };

  // Salvar novo card ou atualização
  const handleSaveCard = (cardData: Omit<Card, 'id' | 'order'> & { id?: string }) => {
    if (cardData.id) {
      // Edição
      const updated = cards.map((c) =>
        c.id === cardData.id
          ? ({
              ...c,
              ...cardData,
            } as Card)
          : c
      );
      onUpdateCards(updated);
    } else {
      // Criação de novo card
      const newCard: Card = {
        id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        order: cards.filter((c) => c.stageId === cardData.stageId).length,
        ...cardData,
      };

      // Se for criado diretamente na etapa Concluído, comemora!
      const targetStage = pipeline.stages.find((s) => s.id === newCard.stageId);
      if (targetStage?.isCompleted) {
        triggerCompletionConfetti();
      }

      onUpdateCards([...cards, newCard]);
    }
  };

  // Excluir card
  const handleDeleteCard = (cardId: string) => {
    onUpdateCards(cards.filter((c) => c.id !== cardId));
  };

  // Mover via menu rápido (ideal para mobile)
  const handleMoveToStage = (cardId: string, targetStageId: string) => {
    const targetStage = pipeline.stages.find((s) => s.id === targetStageId);
    const card = cards.find((c) => c.id === cardId);

    if (targetStage?.isCompleted) {
      triggerCompletionConfetti();
    }

    if (targetStage?.isBlocked && !card?.blockedReason) {
      setPendingBlockedCard({
        cardId,
        targetStageId,
        newOrder: 0,
      });
      setBlockedModalOpen(true);
      return;
    }

    const updated = cards.map((c) =>
      c.id === cardId
        ? {
            ...c,
            stageId: targetStageId,
            updatedAt: new Date().toISOString(),
          }
        : c
    );
    onUpdateCards(updated);
  };

  const currentBlockedCardTitle =
    cards.find((c) => c.id === pendingBlockedCard?.cardId)?.title || '';

  return (
    <div className="w-full flex-1 flex flex-col overflow-hidden">
      {/* Abas de Navegação Rápida para Dispositivos Móveis */}
      <div className="md:hidden px-4 py-2 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {pipeline.stages.map((stg) => {
          const count = cards.filter((c) => c.stageId === stg.id).length;
          const isActive = activeMobileStageId === stg.id;
          return (
            <button
              key={stg.id}
              onClick={() => {
                setActiveMobileStageId(stg.id);
                const el = document.getElementById(`stage-col-${stg.id}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
              }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stg.color }} />
              <span>{stg.name}</span>
              <span className="opacity-75 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Área das Colunas do Pipeline */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 p-4 md:p-6 overflow-x-auto overflow-y-hidden">
          <div className="flex items-start gap-4 h-full pb-4 min-w-max">
            {pipeline.stages.map((stage) => {
              const stageCards = cards
                .filter((c) => c.stageId === stage.id)
                .sort((a, b) => a.order - b.order);

              return (
                <div key={stage.id} id={`stage-col-${stage.id}`}>
                  <PipelineColumn
                    stage={stage}
                    stages={pipeline.stages}
                    cards={stageCards}
                    onAddCard={handleOpenAddCard}
                    onEditCard={handleOpenEditCard}
                    onDeleteCard={handleDeleteCard}
                    onMoveToStage={handleMoveToStage}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Overlay enquanto estiver sendo arrastado */}
        <DragOverlay>
          {activeCard ? (
            <div className="w-80 pointer-events-none rotate-2">
              <PipelineCard
                card={activeCard}
                index={0}
                stages={pipeline.stages}
                onEdit={() => {}}
                onDelete={() => {}}
                onMoveToStage={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modal de Criação / Edição de Card */}
      <CardModal
        isOpen={cardModalOpen}
        initialCard={selectedCard}
        stageId={targetStageIdForNewCard}
        pipelineId={pipeline.id}
        isStageBlocked={
          pipeline.stages.find((s) => s.id === targetStageIdForNewCard)?.isBlocked
        }
        onSave={handleSaveCard}
        onClose={() => {
          setCardModalOpen(false);
          setSelectedCard(null);
        }}
        onDelete={handleDeleteCard}
      />

      {/* Modal de Motivo de Bloqueio */}
      <BlockedReasonModal
        isOpen={blockedModalOpen}
        cardTitle={currentBlockedCardTitle}
        onConfirm={handleConfirmBlockedReason}
        onCancel={handleCancelBlocked}
      />
    </div>
  );
};
