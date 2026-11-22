import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BlockedReasonModal } from '@/components/ui/BlockedReasonModal';

describe('BlockedReasonModal Component', () => {
  it('não deve renderizar quando isOpen for false', () => {
    const { container } = render(
      <BlockedReasonModal
        isOpen={false}
        cardTitle="Tarefa Teste"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar o título da tarefa e disparar confirmação com o motivo digitado', () => {
    const onConfirmMock = vi.fn();
    const onCancelMock = vi.fn();

    render(
      <BlockedReasonModal
        isOpen={true}
        cardTitle="Subir servidor de produção"
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      />
    );

    expect(screen.getByText('Tarefa Bloqueada')).toBeInTheDocument();
    expect(screen.getByText('Subir servidor de produção')).toBeInTheDocument();

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, {
      target: { value: 'Servidor fora do ar por falta de DNS' },
    });

    const submitBtn = screen.getByRole('button', { name: /Confirmar Bloqueio/i });
    fireEvent.click(submitBtn);

    expect(onConfirmMock).toHaveBeenCalledWith('Servidor fora do ar por falta de DNS');
  });

  it('deve exibir mensagem de validação ao tentar confirmar com campo vazio', () => {
    const onConfirmMock = vi.fn();

    render(
      <BlockedReasonModal
        isOpen={true}
        cardTitle="Tarefa Teste"
        onConfirm={onConfirmMock}
        onCancel={vi.fn()}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /Confirmar Bloqueio/i });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(/Por favor, informe o motivo do bloqueio/i)
    ).toBeInTheDocument();
    expect(onConfirmMock).not.toHaveBeenCalled();
  });
});
