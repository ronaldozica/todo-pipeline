'use client';

import React, { useState, useEffect } from 'react';
import { Card, Priority, FibonacciDifficulty, FIBONACCI_POINTS, PRIORITY_CONFIG } from '@/types/pipeline';
import { CardSchema } from '@/lib/validations/card';
import { HelpCircle, Calendar, Link as LinkIcon, AlertCircle, X, Check, Clock } from 'lucide-react';
import { FibonacciHelperModal } from './FibonacciHelperModal';

interface CardModalProps {
  isOpen: boolean;
  initialCard?: Partial<Card> | null;
  stageId: string;
  pipelineId: string;
  isStageBlocked?: boolean;
  onSave: (cardData: Omit<Card, 'id' | 'order'> & { id?: string }) => void;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  initialCard,
  stageId,
  pipelineId,
  isStageBlocked = false,
  onSave,
  onClose,
  onDelete,
}) => {
  const isEditing = Boolean(initialCard?.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIA');
  const [difficulty, setDifficulty] = useState<FibonacciDifficulty>(1);
  const [link, setLink] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [blockedReason, setBlockedReason] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createdAt, setCreatedAt] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (initialCard) {
        setTitle(initialCard.title || '');
        setDescription(initialCard.description || '');
        setPriority(initialCard.priority || 'MEDIA');
        setDifficulty(initialCard.difficulty ?? 1);
        setLink(initialCard.link || '');
        setDueDate(initialCard.dueDate || '');
        setBlockedReason(initialCard.blockedReason || '');
        setCreatedAt(initialCard.createdAt || new Date().toISOString());
        setUpdatedAt(initialCard.updatedAt || new Date().toISOString());
      } else {
        const nowIso = new Date().toISOString();
        // Valores padrão para criação
        setTitle('');
        setDescription('');
        setPriority('MEDIA');
        setDifficulty(1);
        setLink('');
        setDueDate('');
        setBlockedReason('');
        setCreatedAt(nowIso);
        setUpdatedAt(nowIso);
      }
      setErrors({});
    }
  }, [isOpen, initialCard]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nowIso = new Date().toISOString();
    const payload = {
      id: initialCard?.id,
      stageId: initialCard?.stageId || stageId,
      pipelineId: initialCard?.pipelineId || pipelineId,
      userId: initialCard?.userId,
      title,
      description: description.trim() || undefined,
      priority,
      difficulty: String(difficulty), // passado como string para o Zod converter
      link: link.trim() || undefined,
      dueDate: dueDate || undefined,
      blockedReason: blockedReason.trim() || undefined,
      createdAt,
      updatedAt: nowIso,
    };

    const result = CardSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0]?.toString() || 'general';
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onSave({
      id: initialCard?.id,
      stageId: payload.stageId,
      pipelineId: payload.pipelineId,
      userId: payload.userId,
      title: result.data.title,
      description: result.data.description,
      priority: result.data.priority as Priority,
      difficulty: result.data.difficulty as FibonacciDifficulty,
      link: result.data.link,
      dueDate: result.data.dueDate,
      blockedReason: result.data.blockedReason,
      createdAt,
      updatedAt: nowIso,
    });

    onClose();
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
        <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="px-6 py-4.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/40">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {isEditing ? 'Editar Tarefa' : 'Nova Tarefa no Pipeline'}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Preencha os dados da tarefa (* campos obrigatórios)
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form com Scroll */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4.5 text-sm flex-1">
            {/* Nome da Tarefa * */}
            <div>
              <label htmlFor="cardTitle" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Nome da Tarefa <span className="text-rose-500">*</span>
              </label>
              <input
                id="cardTitle"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                placeholder="Ex: Desenvolver nova tela de login"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  errors.title ? 'border-rose-500' : 'border-zinc-300 dark:border-zinc-700'
                } bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition`}
                autoFocus
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
            </div>

            {/* Grid: Prioridade * & Dificuldade Estimada * */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Prioridade * */}
              <div>
                <label htmlFor="cardPriority" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Prioridade <span className="text-rose-500">*</span>
                </label>
                <select
                  id="cardPriority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="MUITO_ALTA">🔴 Muito Alta</option>
                  <option value="ALTA">🟠 Alta</option>
                  <option value="MEDIA">🟡 Média</option>
                  <option value="BAIXA">🔵 Baixa</option>
                  <option value="MUITO_BAIXA">⚪ Muito Baixa</option>
                </select>
              </div>

              {/* Dificuldade Estimada (Story Points) * com Botão de Ajuda */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="cardDifficulty" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                    Dificuldade (Story Points) <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsHelpOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Como funciona?
                  </button>
                </div>
                <select
                  id="cardDifficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value) as FibonacciDifficulty)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
                >
                  {FIBONACCI_POINTS.map((pts) => (
                    <option key={pts} value={pts}>
                      {pts} {pts === 0.5 ? 'ponto (< 30 min)' : pts === 1 ? 'ponto (~1-2h)' : pts === 2 ? 'pontos (~4h)' : pts === 3 ? 'pontos (~1 dia)' : pts === 5 ? 'pontos (~2-3 dias)' : `${pts} pontos (tarefa grande)`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="cardDescription" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Descrição
              </label>
              <textarea
                id="cardDescription"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalhes, critérios de aceitação, anotações..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Grid: Link e Data Limite */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cardLink" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Link Externo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="cardLink"
                    type="url"
                    value={link}
                    onChange={(e) => {
                      setLink(e.target.value);
                      if (errors.link) setErrors((prev) => ({ ...prev, link: '' }));
                    }}
                    placeholder="https://exemplo.com"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border ${
                      errors.link ? 'border-rose-500' : 'border-zinc-300 dark:border-zinc-700'
                    } bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition`}
                  />
                </div>
                {errors.link && <p className="text-xs text-rose-500 mt-1">{errors.link}</p>}
              </div>

              <div>
                <label htmlFor="cardDueDate" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Data Limite
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    id="cardDueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Motivo do Bloqueio (visível se estiver bloqueado ou em etapa bloqueada) */}
            {(isStageBlocked || blockedReason) && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl space-y-1.5">
                <label htmlFor="cardBlockedReason" className="block text-xs font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
                  Motivo do Bloqueio
                </label>
                <textarea
                  id="cardBlockedReason"
                  rows={2}
                  value={blockedReason}
                  onChange={(e) => setBlockedReason(e.target.value)}
                  placeholder="Explique o impedimento da tarefa..."
                  className="w-full px-3 py-2 rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition"
                />
              </div>
            )}

            {/* Datas Automáticas / Somente Leitura * */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Data de Criação * (Automático)
                </span>
                <span className="font-mono text-zinc-700 dark:text-zinc-300">
                  {formatDate(createdAt)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Última Alteração * (Automático)
                </span>
                <span className="font-mono text-zinc-700 dark:text-zinc-300">
                  {formatDate(updatedAt)}
                </span>
              </div>
            </div>

            {/* Rodapé e Ações */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              {isEditing && onDelete && initialCard?.id ? (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                      onDelete(initialCard.id!);
                      onClose();
                    }
                  }}
                  className="px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                >
                  Excluir Tarefa
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {isEditing ? 'Salvar Alterações' : 'Criar Tarefa'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Modal explicativo de Fibonacci */}
      <FibonacciHelperModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};
