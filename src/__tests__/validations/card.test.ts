import { describe, it, expect } from 'vitest';
import { CardSchema } from '@/lib/validations/card';

describe('CardSchema Validation', () => {
  it('deve validar com sucesso um card válido com campos obrigatórios', () => {
    const validData = {
      stageId: 'stage-1',
      pipelineId: 'pipe-1',
      title: 'Implementar autenticação Google',
      priority: 'ALTA',
      difficulty: '3',
    };

    const result = CardSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('Implementar autenticação Google');
      expect(result.data.priority).toBe('ALTA');
      expect(result.data.difficulty).toBe(3);
    }
  });

  it('deve falhar se o título estiver vazio', () => {
    const invalidData = {
      stageId: 'stage-1',
      pipelineId: 'pipe-1',
      title: '   ',
      priority: 'MEDIA',
      difficulty: '1',
    };

    const result = CardSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('deve falhar com dificuldade fora da escala Fibonacci', () => {
    const invalidData = {
      stageId: 'stage-1',
      pipelineId: 'pipe-1',
      title: 'Card teste',
      priority: 'MEDIA',
      difficulty: '7', // 7 não está na escala Fibonacci
    };

    const result = CardSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('deve validar URLs válidas no campo link', () => {
    const dataWithValidLink = {
      stageId: 'stage-1',
      pipelineId: 'pipe-1',
      title: 'Tarefa com link',
      priority: 'BAIXA',
      difficulty: '0.5',
      link: 'https://github.com/todo-pipeline',
    };

    const result = CardSchema.safeParse(dataWithValidLink);
    expect(result.success).toBe(true);
  });

  it('deve rejeitar URLs sem protocolo http/https', () => {
    const dataWithInvalidLink = {
      stageId: 'stage-1',
      pipelineId: 'pipe-1',
      title: 'Tarefa com link inválido',
      priority: 'BAIXA',
      difficulty: '0.5',
      link: 'github.com/invalido',
    };

    const result = CardSchema.safeParse(dataWithInvalidLink);
    expect(result.success).toBe(false);
  });
});
