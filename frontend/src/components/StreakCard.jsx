export default function StreakCard({ streak }) {
  const { current, best } = streak;
  const isOnFire = current >= 3;

  return (
    <div className={`p-6 rounded-2xl shadow-lg transition-all ${
      isOnFire
        ? 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white'
        : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
    }`}>
      <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
        🔥 Streak
      </h3>

      <div className="flex items-end gap-2 mb-2">
        <div className={`text-6xl font-extrabold ${isOnFire ? 'animate-pulse' : ''}`}>
          {current}
        </div>
        <div className="text-lg opacity-80 mb-2">
          {current === 1 ? 'day' : 'days'}
        </div>
      </div>

      <p className="text-sm opacity-90 mb-3">
        {current === 0
          ? 'Start your streak today!'
          : current < 3
          ? 'Keep going! 💪'
          : current < 7
          ? 'You\'re on fire! 🔥'
          : 'UNSTOPPABLE! 🦁'}
      </p>

      <div className="text-xs opacity-75 pt-2 border-t border-white/20">
        🏆 Best: <b>{best} {best === 1 ? 'day' : 'days'}</b>
      </div>
    </div>
  );
}
