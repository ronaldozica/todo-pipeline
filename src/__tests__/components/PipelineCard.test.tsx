import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PipelineCard } from '@/components/card/PipelineCard';
import { Card, Stage } from '@/types/pipeline';

// Mock dnd-kit hooks
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

describe('PipelineCard Component', () => {
  const mockCard: Card = {
    id: 'test-card-1',
    pipelineId: 'pipe-1',
    stageId: 'stage-1',
    title: 'Testar componentização limpa',
    description: 'Verificar se o card renderiza todas as propriedades obrigatórias e opcionais.',
    priority: 'ALTA',
    difficulty: 3,
    link: 'https://github.com',
    dueDate: '2026-12-01',
    order: 0,
    createdAt: '2026-11-20T12:00:00.000Z',
    updatedAt: '2026-11-20T12:00:00.000Z',
  };

  const mockStages: Stage[] = [
    { id: 'stage-1', pipelineId: 'pipe-1', name: 'Inbox', order: 0, color: '#0ea5e9' },
    { id: 'stage-2', pipelineId: 'pipe-1', name: 'Concluído', order: 1, color: '#10b981', isCompleted: true },
  ];

  it('deve renderizar o título, badge de prioridade e story points', () => {
    render(
      <PipelineCard
        card={mockCard}
        index={0}
        stages={mockStages}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onMoveToStage={vi.fn()}
      />
    );

    expect(screen.getByText('Testar componentização limpa')).toBeInTheDocument();
    expect(screen.getByText('Alta')).toBeInTheDocument();
    expect(screen.getByText('3 pts')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('deve exibir o motivo de bloqueio quando a tarefa estiver bloqueada', () => {
    const blockedCard: Card = {
      ...mockCard,
      blockedReason: 'Aguardando liberação de token pelo gestor',
    };

    render(
      <PipelineCard
        card={blockedCard}
        index={1}
        stages={mockStages}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onMoveToStage={vi.fn()}
      />
    );

    expect(
      screen.getByText(/Aguardando liberação de token pelo gestor/i)
    ).toBeInTheDocument();
  });
});
