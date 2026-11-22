import { z } from 'zod';
import { FIBONACCI_POINTS } from '@/types/pipeline';

/**
 * Schema de validação do Card
 * Garante que regras de negócio e campos obrigatórios sejam respeitados
 */
export const CardSchema = z.object({
  id: z.string().optional(),
  stageId: z.string().min(1, 'A etapa é obrigatória'),
  pipelineId: z.string().min(1, 'O pipeline é obrigatório'),
  userId: z.string().optional(),
  title: z
    .string()
    .trim()
    .min(1, 'O nome da tarefa é obrigatório')
    .max(120, 'O nome da tarefa não pode exceder 120 caracteres'),
  description: z.string().optional(),
  priority: z.enum(['MUITO_BAIXA', 'BAIXA', 'MEDIA', 'ALTA', 'MUITO_ALTA'], {
    message: 'Prioridade inválida',
  }),
  difficulty: z.enum(
    FIBONACCI_POINTS.map(String) as [string, ...string[]],
    { message: 'Dificuldade de Story Points inválida' }
  ).transform((val) => Number(val)),
  link: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || val === '' || /^https?:\/\//i.test(val),
      'O link deve começar com http:// ou https://'
    ),
  dueDate: z.string().optional(),
  blockedReason: z.string().optional(),
  order: z.number().default(0),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type CardInput = z.infer<typeof CardSchema>;
