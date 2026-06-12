export default function PersonalRecords({ stats }) {
  const prs = stats.prs || [];

  if (prs.length === 0) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-yellow-950 p-6 rounded-2xl shadow-lg transition-colors duration-500">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">🏆 Personal Records</h3>
        <div className="h-32 flex items-center justify-center text-gray-400 dark:text-gray-500 text-center">
          <div>
            <div className="text-4xl mb-1">🎯</div>
            <p className="text-sm">Hit a new max to claim your first PR!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-gray-800 dark:via-yellow-950 dark:to-pink-950 p-6 rounded-2xl shadow-lg transition-colors duration-500">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">🏆 Personal Records</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Your all-time maxes</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {prs.map((pr, i) => (
          <div
            key={pr.exercise}
            className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm hover:shadow-md transition border-l-4 border-yellow-400"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {i === 0 ? '👑 #1' : `#${i + 1}`}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{pr.achieved_at}</span>
            </div>
            <div className="font-bold text-gray-800 dark:text-white">{pr.exercise}</div>
            <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              {pr.max_weight} <span className="text-sm text-gray-500 dark:text-gray-400">kg</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
