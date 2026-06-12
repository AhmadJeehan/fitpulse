import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function PRCelebration({ pr, onClose }) {
  useEffect(() => {
    // Fire confetti!
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fbbf24', '#f59e0b', '#ec4899', '#8b5cf6'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fbbf24', '#f59e0b', '#ec4899', '#8b5cf6'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  if (!pr) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-bounce-in transition-colors duration-300">
        <div className="text-7xl mb-3 animate-pulse">🏆</div>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 mb-2">
          NEW PR!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-1">You crushed</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{pr.exercise}</p>
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mb-4">
          <div className="text-4xl font-extrabold text-orange-600">
            {pr.newMax} <span className="text-xl">kg</span>
          </div>
          {pr.previousMax > 0 && (
            <div className="text-sm text-gray-600 mt-1">
              Previous: <s>{pr.previousMax}kg</s> → +{(pr.newMax - pr.previousMax).toFixed(1)}kg 🎉
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl font-semibold hover:opacity-90"
        >
          Let's Gooo! 💪
        </button>
      </div>
    </div>
  );
}
