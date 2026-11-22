import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FibonacciHelperModal } from '@/components/ui/FibonacciHelperModal';

describe('FibonacciHelperModal Component', () => {
  it('não deve renderizar quando isOpen for false', () => {
    const { container } = render(
      <FibonacciHelperModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar as explicações de Story Points quando aberto', () => {
    const onCloseMock = vi.fn();
    render(<FibonacciHelperModal isOpen={true} onClose={onCloseMock} />);

    expect(screen.getByText('O que são Story Points?')).toBeInTheDocument();
    expect(screen.getByText('< 30 minutos')).toBeInTheDocument();
    expect(screen.getByText('1 a 2 horas')).toBeInTheDocument();
    expect(screen.getByText('Meio período (~4h)')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Entendi perfeitamente/i });
    fireEvent.click(closeBtn);
    expect(onCloseMock).toHaveBeenCalled();
  });
});
