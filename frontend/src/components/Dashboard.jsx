import { useState, useEffect } from 'react';
import { api } from '../api';
import { useTheme } from '../hooks/useTheme';
import WorkoutForm from './WorkoutForm';
import { StrengthChart, VolumeChart, TopExercisesChart } from './Charts';
import PersonalRecords from './PersonalRecords';
import PRCelebration from './PRCelebration';
import GoalCard from './GoalCard';
import StreakCard from './StreakCard';
import ThemeToggle from './ThemeToggle';

export default function Dashboard({ user, onLogout }) {
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    byExercise: [],
    prs: [],
    goal: { weekly: 4, progress: 0, percentage: 0 },
    streak: { current: 0, best: 0 },
  });
  const [prCelebration, setPrCelebration] = useState(null);
  const { theme, toggle } = useTheme();

  const refreshStats = async () => {
    const s = await api.getStats();
    setStats(s);
  };

  const load = async () => {
    const [w, s] = await Promise.all([api.getWorkouts(), api.getStats()]);
    setWorkouts(w);
    setStats(s);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    await api.deleteWorkout(id);
    load();
  };

  const handleAddWorkout = async (data) => {
    const result = await api.addWorkout(data);
    if (result.isPR) {
      setPrCelebration(result);
    }
    await load();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center transition-colors duration-500">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">💪 FitPulse</h1>
          {stats.streak?.current > 0 && (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
              🔥 {stats.streak.current}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 dark:text-gray-300 hidden sm:inline">
            Hi, <b>{user.name || user.email}</b>
          </span>
          <ThemeToggle theme={theme} toggle={toggle} />
          <button
            onClick={onLogout}
            className="text-sm text-red-500 dark:text-red-400 hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center transition-colors duration-500">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalWorkouts}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">Total Workouts</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center transition-colors duration-500">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{Math.round(stats.totalVolume)}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">Total Volume (kg)</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center transition-colors duration-500">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">{stats.byExercise.length}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">Unique Exercises</div>
          </div>
        </div>

        {/* Goal & Streak */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GoalCard stats={stats} onUpdate={refreshStats} />
          <StreakCard streak={stats.streak} />
        </div>

        <WorkoutForm onAdded={handleAddWorkout} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StrengthChart workouts={workouts} />
          <VolumeChart workouts={workouts} />
        </div>
        <TopExercisesChart stats={stats} />
        <PersonalRecords stats={stats} />

        {/* Recent Workouts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow transition-colors duration-500">
          <h2 className="text-xl font-bold p-6 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
            📋 Recent Workouts
          </h2>
          {workouts.length === 0 ? (
            <p className="p-6 text-gray-500 dark:text-gray-400 text-center">
              No workouts yet. Add your first one! 💪
            </p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {workouts.map((w) => (
                <li key={w.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{w.exercise}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {w.sets} × {w.reps} @ {w.weight}kg
                      {w.notes && ` • ${w.notes}`}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{w.workout_date}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="text-red-500 dark:text-red-400 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {prCelebration && (
        <PRCelebration
          pr={prCelebration}
          onClose={() => setPrCelebration(null)}
        />
      )}
    </div>
  );
}
