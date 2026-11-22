'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Lock } from 'lucide-react';

interface BlockedReasonModalProps {
  isOpen: boolean;
  cardTitle: string;
  initialReason?: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

/**
 * Modal exibido imediatamente quando um card é arrastado para a etapa 'Bloqueado'
 * Garante que nenhuma tarefa fique bloqueada sem um motivo claro e transparente
 */
export const BlockedReasonModal: React.FC<BlockedReasonModalProps> = ({
  isOpen,
  cardTitle,
  initialReason = '',
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState(initialReason);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason(initialReason || '');
      setError('');
    }
  }, [isOpen, initialReason]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Por favor, informe o motivo do bloqueio para ajudar no desbloqueio da tarefa.');
      return;
    }
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Cabeçalho de Alerta */}
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-rose-50 dark:bg-rose-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-rose-900 dark:text-rose-100">
                Tarefa Bloqueada
              </h2>
              <p className="text-xs text-rose-700/80 dark:text-rose-300/80">
                Qual é o impedimento para continuar?
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-rose-400 hover:text-rose-700 dark:hover:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition"
            aria-label="Cancelar bloqueio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Tarefa: </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {cardTitle}
            </span>
          </div>

          <div>
            <label
              htmlFor="blockedReason"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
            >
              Motivo do Bloqueio <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="blockedReason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              rows={3}
              placeholder="Ex: Dependendo da resposta do fornecedor, aguardando acesso ao servidor, falta de documentação..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-sm transition"
              autoFocus
            />
            {error && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{error}</p>}
          </div>

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition flex items-center gap-1.5 shadow-xs"
            >
              <Lock className="w-4 h-4" />
              Confirmar Bloqueio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
