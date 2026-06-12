import { useState } from 'react';
import { api } from '../api';

export default function GoalCard({ stats, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [newGoal, setNewGoal] = useState(stats.goal.weekly);

  const { weekly, progress, percentage } = stats.goal;
  const isComplete = progress >= weekly;
  const message = isComplete
    ? '🎉 Goal crushed! You\'re unstoppable!'
    : progress === weekly - 1
    ? '💪 One more to go!'
    : progress >= weekly / 2
    ? '🔥 Halfway there!'
    : '🚀 Let\'s get started!';

  const save = async () => {
    await api.setGoal(newGoal);
    setEditing(false);
    onUpdate();
  };

  return (
    <div className={`p-6 rounded-2xl shadow-lg transition-all ${
      isComplete
        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
        : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            🎯 Weekly Goal
          </h3>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={save}
              className="text-xs bg-white text-indigo-600 px-3 py-1 rounded-full font-semibold"
            >
              Save
            </button>
            <button
              onClick={() => { setEditing(false); setNewGoal(weekly); }}
              className="text-xs bg-white/20 px-3 py-1 rounded-full"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="flex items-end gap-2 mb-3">
        <div className="text-5xl font-extrabold">{progress}</div>
        <div className="text-2xl opacity-80 mb-1">/ {weekly}</div>
        {isComplete && <div className="text-3xl mb-1 animate-bounce">🏆</div>}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-700 ease-out shadow-lg"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right text-xs opacity-80 mt-1">{percentage}%</div>

      {editing && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="range" min="1" max="7"
            value={newGoal}
            onChange={(e) => setNewGoal(+e.target.value)}
            className="flex-1"
          />
          <span className="font-bold text-lg w-8 text-center">{newGoal}</span>
        </div>
      )}
    </div>
  );
}
