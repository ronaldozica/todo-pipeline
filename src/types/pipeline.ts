/**
 * Tipos fundamentais do Todo Pipeline
 * Segue Clean Architecture e Clean Code com tipagem estrita
 */

export type Priority = 'MUITO_BAIXA' | 'BAIXA' | 'MEDIA' | 'ALTA' | 'MUITO_ALTA';

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; badgeClass: string }> = {
  MUITO_BAIXA: {
    label: 'Muito Baixa',
    color: '#94a3b8',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
  },
  BAIXA: {
    label: 'Baixa',
    color: '#3b82f6',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  MEDIA: {
    label: 'Média',
    color: '#eab308',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  ALTA: {
    label: 'Alta',
    color: '#f97316',
    badgeClass: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  },
  MUITO_ALTA: {
    label: 'Muito Alta',
    color: '#ef4444',
    badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  },
};

export const FIBONACCI_POINTS = [0.5, 1, 2, 3, 5, 8, 13, 20] as const;
export type FibonacciDifficulty = (typeof FIBONACCI_POINTS)[number];

export interface FibonacciHelpItem {
  points: FibonacciDifficulty;
  timeEstimate: string;
  description: string;
}

export const FIBONACCI_EXPLANATION: FibonacciHelpItem[] = [
  { points: 0.5, timeEstimate: '< 30 minutos', description: 'Trivial e rápida. Quase sem esforço mental.' },
  { points: 1, timeEstimate: '1 a 2 horas', description: 'Simples, bem definida e sem dependências.' },
  { points: 2, timeEstimate: 'Meio período (~4h)', description: 'Tamanho médio padrão de uma tarefa focada.' },
  { points: 3, timeEstimate: '1 dia inteiro', description: 'Complexidade moderada, requer atenção dedicada.' },
  { points: 5, timeEstimate: '2 a 3 dias', description: 'Trabalhosa ou com mais etapas envolvidas.' },
  { points: 8, timeEstimate: 'Quase 1 semana', description: 'Muito grande. Considere quebrar em tarefas menores.' },
  { points: 13, timeEstimate: 'Mais de 1 semana', description: 'Projeto em si. Recomenda-se dividir em subtarefas.' },
  { points: 20, timeEstimate: 'Épico / Gigante', description: 'Complexidade extrema ou escopo incerto.' },
];

export interface Card {
  id: string;
  stageId: string;
  pipelineId: string;
  userId?: string;
  title: string;
  description?: string;
  priority: Priority;
  difficulty: FibonacciDifficulty;
  link?: string;
  dueDate?: string;
  blockedReason?: string;
  order: number;
  createdAt: string; // ISO String - preenchimento automático
  updatedAt: string; // ISO String - preenchimento automático
}

export interface Stage {
  id: string;
  pipelineId: string;
  name: string;
  order: number;
  color: string;
  isBlocked?: boolean;
  isCompleted?: boolean;
}

export interface Pipeline {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  stages: Stage[];
  createdAt: string;
  updatedAt: string;
}
