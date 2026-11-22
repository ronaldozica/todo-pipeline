# Todo Pipeline

Um gerenciador de tarefas moderno inspirado no fluxo contínuo de pipelines de CI/CD. Organizado no formato Kanban com etapas configuráveis, estimativa por Story Points (Fibonacci), animações comemorativas e suporte a múltiplos pipelines.

---

## Principais Funcionalidades

- **Pipeline Contínuo:** Arraste e solte tarefas entre as colunas com fluidez tanto no computador quanto no celular (via touch).
- **Etapas Padrão:**
  - `Inbox` (Tarefas recém-chegadas)
  - `Hoje` (Foco do dia)
  - `Em andamento` (Em execução)
  - `Bloqueado` (Abre modal obrigatório solicitando motivo do impedimento)
  - `Concluído` (Dispara chuva de confetes comemorativa)
- **Story Points Explicados:**
  - Escala Fibonacci adaptada: `0.5, 1, 2, 3, 5, 8, 13, 20`
  - Guia integrado com explicações práticas para quem não é da área técnica.
- **Múltiplos Pipelines:**
  - Alterne facilmente entre fluxos como **Trabalho**, **Casa**, **Estudos** ou crie seus próprios pipelines.
- **Campos do Card:**
  - Nome (Obrigatório)
  - Prioridade (Muito alta, Alta, Média, Baixa, Muito baixa)
  - Dificuldade estimada (Story points)
  - Descrição
  - Link externo
  - Data limite
  - Data de criação (automático / somente leitura)
  - Data da última alteração (automático / somente leitura)
- **100% Gratuito:**
  - Frontend no Next.js (Vercel Free Tier).
  - Banco de dados e autenticação Google via Supabase Free Tier.
  - Armazenamento local automático em navegadores sem necessidade inicial de configuração.

---

## Como Rodar Localmente

1. Clone o repositório ou acesse a pasta do projeto:
```bash
cd todo-pipeline
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## Testes Automatizados

O projeto conta com testes unitários e de componentes configurados com Vitest e Testing Library:

```bash
# Executa todos os testes
npm test

# Modo interativo (watch)
npm run test:watch
```

---

## Configuração do Supabase (Login com Google & Nuvem Gratuita)

1. Crie uma conta gratuita em [Supabase](https://supabase.com).
2. Crie um novo projeto.
3. No menu **SQL Editor**, execute o script presente em `supabase/schema.sql`.
4. Em **Authentication -> Providers**, ative o **Google** informando seu Client ID e Secret do Google Cloud Console.
5. Copie o arquivo `.env.example` para `.env.local` e preencha suas chaves:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

---

## Arquitetura e Tecnologias

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Estilos:** Tailwind CSS v4
- **Drag & Drop:** `@dnd-kit/core` e `@dnd-kit/sortable`
- **Validação:** Zod
- **Animações:** `canvas-confetti`
- **Ícones:** Lucide React
- **Testes:** Vitest + React Testing Library
