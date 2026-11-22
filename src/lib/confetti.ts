import confetti from 'canvas-confetti';

/**
 * Dispara uma animação festiva de confetes
 * Utilizada ao arrastar ou concluir uma tarefa na etapa "Concluído"
 */
export function triggerCompletionConfetti() {
  // Primeira explosão central
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'],
  });

  // Fogos de artifício laterais para dar dinamismo
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#10b981', '#3b82f6', '#34d399'],
    });
  }, 150);

  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#f59e0b', '#ec4899', '#6366f1'],
    });
  }, 300);
}
