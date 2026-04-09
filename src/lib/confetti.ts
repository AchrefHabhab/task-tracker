import confetti from 'canvas-confetti';

export function fireConfetti() {
  const defaults = {
    spread: 360,
    ticks: 70,
    gravity: 0.5,
    decay: 0.94,
    startVelocity: 20,
    colors: ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444'],
  };

  confetti({
    ...defaults,
    particleCount: 30,
    scalar: 1.2,
    shapes: ['circle', 'square'],
  });

  confetti({
    ...defaults,
    particleCount: 20,
    scalar: 0.75,
    shapes: ['circle'],
  });
}
