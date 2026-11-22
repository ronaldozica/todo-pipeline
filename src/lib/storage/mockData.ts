import { Pipeline } from '@/types/pipeline';

/**
 * Etapas padrão sugeridas para qualquer novo pipeline
 */
export const DEFAULT_STAGE_TEMPLATES = [
  { name: 'Inbox', color: '#0ea5e9', isBlocked: false, isCompleted: false },
  { name: 'Hoje', color: '#f59e0b', isBlocked: false, isCompleted: false },
  { name: 'Em andamento', color: '#3b82f6', isBlocked: false, isCompleted: false },
  { name: 'Bloqueado', color: '#ef4444', isBlocked: true, isCompleted: false },
  { name: 'Concluído', color: '#10b981', isBlocked: false, isCompleted: true },
];

const now = '2026-11-20T12:00:00.000Z';

/**
 * Pipelines iniciais padrão com tarefas de exemplo demonstrando todas as funcionalidades:
 * - Story points Fibonacci
 * - Níveis de prioridade
 * - Bloqueio com motivo
 * - Concluído com confetes
 */
export const INITIAL_PIPELINES: Pipeline[] = [
  {
    id: 'pipe-work',
    name: 'Trabalho',
    description: 'Pipeline principal de desenvolvimento e entregas profissionais',
    isDefault: true,
    createdAt: now,
    updatedAt: now,
    stages: [
      {
        id: 'stage-inbox-work',
        pipelineId: 'pipe-work',
        name: 'Inbox',
        order: 0,
        color: '#0ea5e9',
        isBlocked: false,
        isCompleted: false,
      },
      {
        id: 'stage-today-work',
        pipelineId: 'pipe-work',
        name: 'Hoje',
        order: 1,
        color: '#f59e0b',
        isBlocked: false,
        isCompleted: false,
      },
      {
        id: 'stage-progress-work',
        pipelineId: 'pipe-work',
        name: 'Em andamento',
        order: 2,
        color: '#3b82f6',
        isBlocked: false,
        isCompleted: false,
      },
      {
        id: 'stage-blocked-work',
        pipelineId: 'pipe-work',
        name: 'Bloqueado',
        order: 3,
        color: '#ef4444',
        isBlocked: true,
        isCompleted: false,
      },
      {
        id: 'stage-completed-work',
        pipelineId: 'pipe-work',
        name: 'Concluído',
        order: 4,
        color: '#10b981',
        isBlocked: false,
        isCompleted: true,
      },
    ],
  },
  {
    id: 'pipe-home',
    name: 'Casa',
    description: 'Organização doméstica, compras e manutenção',
    isDefault: false,
    createdAt: now,
    updatedAt: now,
    stages: [
      { id: 'stage-inbox-home', pipelineId: 'pipe-home', name: 'Inbox', order: 0, color: '#0ea5e9' },
      { id: 'stage-today-home', pipelineId: 'pipe-home', name: 'Hoje', order: 1, color: '#f59e0b' },
      { id: 'stage-progress-home', pipelineId: 'pipe-home', name: 'Em andamento', order: 2, color: '#3b82f6' },
      { id: 'stage-blocked-home', pipelineId: 'pipe-home', name: 'Bloqueado', order: 3, color: '#ef4444', isBlocked: true },
      { id: 'stage-completed-home', pipelineId: 'pipe-home', name: 'Concluído', order: 4, color: '#10b981', isCompleted: true },
    ],
  },
  {
    id: 'pipe-studies',
    name: 'Estudos',
    description: 'Cursos, leitura técnica e certificações',
    isDefault: false,
    createdAt: now,
    updatedAt: now,
    stages: [
      { id: 'stage-inbox-studies', pipelineId: 'pipe-studies', name: 'Inbox', order: 0, color: '#0ea5e9' },
      { id: 'stage-today-studies', pipelineId: 'pipe-studies', name: 'Hoje', order: 1, color: '#f59e0b' },
      { id: 'stage-progress-studies', pipelineId: 'pipe-studies', name: 'Em andamento', order: 2, color: '#3b82f6' },
      { id: 'stage-blocked-studies', pipelineId: 'pipe-studies', name: 'Bloqueado', order: 3, color: '#ef4444', isBlocked: true },
      { id: 'stage-completed-studies', pipelineId: 'pipe-studies', name: 'Concluído', order: 4, color: '#10b981', isCompleted: true },
    ],
  },
];

export const INITIAL_CARDS = [
  {
    id: 'card-1',
    pipelineId: 'pipe-work',
    stageId: 'stage-inbox-work',
    title: 'Pesquisar arquitetura de microsserviços',
    description: 'Levantar prós e contras para a nova funcionalidade de pagamentos.',
    priority: 'MEDIA' as const,
    difficulty: 2 as const,
    link: 'https://martinfowler.com/articles/microservices.html',
    dueDate: '2026-11-28',
    order: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'card-2',
    pipelineId: 'pipe-work',
    stageId: 'stage-today-work',
    title: 'Ajustar responsividade do Header no Mobile',
    description: 'Garantir que os menus dropdown e pipelines fiquem acessíveis em telas menores.',
    priority: 'ALTA' as const,
    difficulty: 1 as const,
    order: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'card-3',
    pipelineId: 'pipe-work',
    stageId: 'stage-progress-work',
    title: 'Implementar autenticação Google OAuth',
    description: 'Integrar fluxo do Supabase com credenciais Google e persistência na nuvem.',
    priority: 'MUITO_ALTA' as const,
    difficulty: 3 as const,
    link: 'https://supabase.com/docs/guides/auth/social-login/auth-google',
    order: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'card-4',
    pipelineId: 'pipe-work',
    stageId: 'stage-blocked-work',
    title: 'Aprovação de orçamento do plano de banco',
    description: 'Aguardando validação do setor financeiro para upgrade do servidor.',
    priority: 'ALTA' as const,
    difficulty: 0.5 as const,
    blockedReason: 'Aguardando retorno do e-mail do setor de faturamento sobre o limite de crédito corporativo.',
    order: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'card-5',
    pipelineId: 'pipe-work',
    stageId: 'stage-completed-work',
    title: 'Setup do projeto Next.js com Tailwind v4',
    description: 'Configuração dos módulos base, testes automatizados e design system.',
    priority: 'MUITO_ALTA' as const,
    difficulty: 2 as const,
    order: 0,
    createdAt: now,
    updatedAt: now,
  },
];
