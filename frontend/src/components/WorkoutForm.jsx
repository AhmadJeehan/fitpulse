import { useState } from 'react';
import { api } from '../api';

const EXERCISES = ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row', 'Pull-ups', 'Other'];

export default function WorkoutForm({ onAdded }) {
  const [form, setForm] = useState({
    exercise: 'Bench Press',
    sets: 3,
    reps: 10,
    weight: 0,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ Build a clean payload with guaranteed values
      const payload = {
        exercise: form.exercise || 'Bench Press',
        sets: Number(form.sets) || 1,
        reps: Number(form.reps) || 1,
        weight: Number(form.weight) || 0,
        notes: form.notes || '',
      };

      console.log('Sending:', payload); // 👈 Debug log
      await onAdded(payload);
      setForm({ ...form, notes: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors duration-500">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">➕ Log a Workout</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <select
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg col-span-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={form.exercise}
          onChange={(e) => setForm({ ...form, exercise: e.target.value })}
        >
          {EXERCISES.map((ex) => <option key={ex}>{ex}</option>)}
        </select>
        <input
          type="number" placeholder="Sets" min="1"
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={form.sets}
          onChange={(e) => setForm({ ...form, sets: e.target.value })}
        />
        <input
          type="number" placeholder="Reps" min="1"
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={form.reps}
          onChange={(e) => setForm({ ...form, reps: e.target.value })}
        />
        <input
          type="number" placeholder="Weight (kg)" min="0" step="0.5"
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
        />
      </div>
      <input
        type="text" placeholder="Notes (optional)"
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg mt-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-3 w-full bg-indigo-600 text-white p-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Logging...' : 'Log Workout'}
      </button>
    </form>
  );
}
