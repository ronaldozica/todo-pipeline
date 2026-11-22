'use client';

import React from 'react';
import { FIBONACCI_EXPLANATION } from '@/types/pipeline';
import { HelpCircle, X, Sparkles, Clock, CheckCircle } from 'lucide-react';

interface FibonacciHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal educativo e intuitivo sobre Story Points
 * Projetado para ser compreendido por qualquer pessoa (desenvolvedores ou não)
 */
export const FibonacciHelperModal: React.FC<FibonacciHelperModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabeçalho */}
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                O que são Story Points?
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Guia simples de estimativa de esforço para o seu dia a dia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com rolagem suave */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-blue-900 dark:text-blue-200 leading-relaxed">
            <span className="font-semibold">💡 Dica de ouro:</span> Story points medem o <strong>esforço relativo</strong> e a <strong>complexidade</strong> de uma tarefa, e não apenas horas no relógio.
            Usamos a sequência de Fibonacci modificada porque quanto maior a tarefa, mais incertezas ela traz!
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {FIBONACCI_EXPLANATION.map((item) => (
              <div key={item.points} className="py-3.5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl font-bold bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 border border-zinc-200 dark:border-zinc-700 shadow-xs">
                    {item.points}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {item.timeEstimate}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                {item.points >= 8 && (
                  <span className="shrink-0 text-[11px] font-medium px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-md border border-amber-200 dark:border-amber-800">
                    Dividir tarefa?
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-xs"
          >
            Entendi perfeitamente
          </button>
        </div>
      </div>
    </div>
  );
};
