'use client';

import React, { useState } from 'react';
import { Pipeline } from '@/types/pipeline';
import {
  GitCommit,
  Layers,
  Plus,
  HelpCircle,
  LogIn,
  LogOut,
  ChevronDown,
  User as UserIcon,
  Check,
} from 'lucide-react';
import { FibonacciHelperModal } from '@/components/ui/FibonacciHelperModal';

interface NavbarProps {
  pipelines: Pipeline[];
  activePipelineId: string;
  onSelectPipeline: (id: string) => void;
  onAddPipeline: (name: string, description?: string) => void;
  user: { email?: string; name?: string; avatarUrl?: string } | null;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  pipelines,
  activePipelineId,
  onSelectPipeline,
  onAddPipeline,
  user,
  onSignInWithGoogle,
  onSignOut,
}) => {
  const [pipelineDropdownOpen, setPipelineDropdownOpen] = useState(false);
  const [newPipelineModalOpen, setNewPipelineModalOpen] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState('');
  const [newPipelineDesc, setNewPipelineDesc] = useState('');
  const [fibonacciHelpOpen, setFibonacciHelpOpen] = useState(false);

  const activePipeline =
    pipelines.find((p) => p.id === activePipelineId) || pipelines[0];

  const handleCreatePipeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPipelineName.trim()) return;

    onAddPipeline(newPipelineName.trim(), newPipelineDesc.trim() || undefined);
    setNewPipelineName('');
    setNewPipelineDesc('');
    setNewPipelineModalOpen(false);
  };

  return (
    <>
      <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30">
        {/* Breadcrumb superior sutil (estilo do print de CI/CD) */}
        <div className="px-4 md:px-6 py-1.5 border-b border-zinc-100 dark:border-zinc-900 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
          <span>Home</span>
          <span>/</span>
          <span>Pipelines</span>
          <span>/</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {activePipeline?.name}
          </span>
        </div>

        <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          {/* Lado Esquerdo: Logo & Seletor de Pipelines */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <GitCommit className="w-5 h-5 rotate-90" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                  Todo Pipeline
                </h1>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  CI/CD Kanban Inteligente
                </p>
              </div>
            </div>

            <div className="h-5 w-px bg-zinc-200 dark:border-zinc-800 hidden sm:block" />

            {/* Switcher de Pipelines */}
            <div className="relative">
              <button
                onClick={() => setPipelineDropdownOpen((prev) => !prev)}
                className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 transition"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{activePipeline?.name || 'Selecione o Pipeline'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {pipelineDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setPipelineDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-60 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-40 py-1.5 text-xs">
                    <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      Seus Pipelines
                    </div>
                    {pipelines.map((pipe) => (
                      <button
                        key={pipe.id}
                        onClick={() => {
                          onSelectPipeline(pipe.id);
                          setPipelineDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between transition"
                      >
                        <div>
                          <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {pipe.name}
                          </p>
                          {pipe.description && (
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[180px]">
                              {pipe.description}
                            </p>
                          )}
                        </div>
                        {pipe.id === activePipelineId && (
                          <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                        )}
                      </button>
                    ))}

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                    <button
                      onClick={() => {
                        setPipelineDropdownOpen(false);
                        setNewPipelineModalOpen(true);
                      }}
                      className="w-full px-3 py-2 text-left text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2 font-semibold transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Criar Novo Pipeline...
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Lado Direito: Ajuda Story Points e Login com Google */}
          <div className="flex items-center gap-2.5">
            {/* Botão explicativo Story Points */}
            <button
              onClick={() => setFibonacciHelpOpen(true)}
              className="px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 transition"
              title="Entenda como funcionam os Story Points"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden md:inline">O que são Story Points?</span>
            </button>

            {/* Autenticação Google / Perfil */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name || 'User'}
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <UserIcon className="w-4 h-4 text-zinc-500" />
                  )}
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  title="Sair da conta"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignInWithGoogle}
                className="px-3.5 py-1.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Login com Google</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modal para criar novo pipeline */}
      {newPipelineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              Criar Novo Pipeline
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Exemplos: Estudos de Mestrado, Reforma da Casa, Projeto Freelance...
            </p>

            <form onSubmit={handleCreatePipeline} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Nome do Pipeline *
                </label>
                <input
                  type="text"
                  required
                  value={newPipelineName}
                  onChange={(e) => setNewPipelineName(e.target.value)}
                  placeholder="Ex: Treinos & Saúde"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Descrição (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={newPipelineDesc}
                  onChange={(e) => setNewPipelineDesc(e.target.value)}
                  placeholder="Sobre o que é este pipeline..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setNewPipelineModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
                >
                  Criar Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal explicativo de Fibonacci */}
      <FibonacciHelperModal
        isOpen={fibonacciHelpOpen}
        onClose={() => setFibonacciHelpOpen(false)}
      />
    </>
  );
};
