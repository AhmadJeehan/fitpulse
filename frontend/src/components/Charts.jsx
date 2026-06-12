import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart,
  RadialBar
} from 'recharts';

const COLORS = {
  primary: '#6366f1',
  purple: '#8b5cf6',
  pink: '#ec4899',
  green: '#10b981',
  orange: '#f59e0b',
  blue: '#3b82f6',
};

// Custom tooltip styled to match the app
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur shadow-xl rounded-lg p-3 border border-gray-200 dark:border-gray-700">
      <p className="font-semibold text-gray-800 dark:text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="text-sm">
          {p.name}: <span className="font-bold">{p.value}{p.name.includes('Volume') ? ' kg' : ' kg'}</span>
        </p>
      ))}
    </div>
  );
};

// 📈 CHART 1: Strength Progress (Line)
export function StrengthChart({ workouts }) {
  // Group max weight per exercise per date
  const byDateExercise = {};
  workouts.forEach((w) => {
    const key = `${w.workout_date}_${w.exercise}`;
    if (!byDateExercise[key] || byDateExercise[key] < w.weight) {
      byDateExercise[key] = { date: w.workout_date, [w.exercise]: w.weight };
    }
  });

  // Build a unique date list, then pick top 4 exercises
  const allDates = [...new Set(workouts.map((w) => w.workout_date))].sort();
  const exerciseCounts = {};
  workouts.forEach((w) => { exerciseCounts[w.exercise] = (exerciseCounts[w.exercise] || 0) + 1; });
  const topExercises = Object.entries(exerciseCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([e]) => e);

  const data = allDates.map((date) => {
    const row = { date: date.slice(5) }; // MM-DD
    topExercises.forEach((ex) => {
      const w = workouts.find((x) => x.workout_date === date && x.exercise === ex);
      if (w) row[ex] = Math.max(w.weight, ...workouts
        .filter((x) => x.workout_date === date && x.exercise === ex)
        .map((x) => x.weight));
    });
    return row;
  });

  const lineColors = [COLORS.primary, COLORS.pink, COLORS.green, COLORS.orange];

  if (data.length === 0) return <EmptyState message="Log some workouts to see your strength progress 💪" />;

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-950 p-6 rounded-2xl shadow-lg transition-colors duration-500">
      <h3 className="text-lg font-bold text-gray-800 mb-1">💪 Strength Progress</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Max weight lifted over time</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            {lineColors.map((c, i) => (
              <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c} stopOpacity={0.8} />
                <stop offset="100%" stopColor={c} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: 12 }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: 12 }} label={{ value: 'kg', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {topExercises.map((ex, i) => (
            <Line
              key={ex}
              type="monotone"
              dataKey={ex}
              stroke={lineColors[i]}
              strokeWidth={3}
              dot={{ r: 4, fill: lineColors[i] }}
              activeDot={{ r: 7 }}
              animationDuration={1500}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// 🔥 CHART 2: Volume Over Time (Area)
export function VolumeChart({ workouts }) {
  const byDate = {};
  workouts.forEach((w) => {
    const vol = w.sets * w.reps * (w.weight || 0);
    byDate[w.workout_date] = (byDate[w.workout_date] || 0) + vol;
  });

  const data = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, volume]) => ({ date: date.slice(5), volume: Math.round(volume) }));

  if (data.length === 0) return <EmptyState message="Your volume will appear here once you log workouts 🔥" />;

  return (
    <div className="bg-gradient-to-br from-white to-pink-50 p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-1">🔥 Workout Volume</h3>
      <p className="text-sm text-gray-500 mb-4">Total weight moved per session</p>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.pink} stopOpacity={0.8} />
              <stop offset="100%" stopColor={COLORS.pink} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: 12 }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="volume"
            stroke={COLORS.pink}
            strokeWidth={3}
            fill="url(#volGrad)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// 🏆 CHART 3: Top Exercises (Radial Bar)
export function TopExercisesChart({ stats }) {
  const data = (stats.byExercise || []).slice(0, 5).map((e, i) => ({
    name: e.exercise,
    count: e.count,
    fill: [COLORS.primary, COLORS.purple, COLORS.pink, COLORS.green, COLORS.orange][i],
  }));

  if (data.length === 0) return <EmptyState message="Your top exercises will rank here 🏆" />;

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">🏆 Top Exercises</h3>
      <p className="text-sm text-gray-500 mb-4">Your most frequent lifts</p>
      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart
          cx="50%" cy="50%"
          innerRadius="20%" outerRadius="90%"
          data={data}
          startAngle={90} endAngle={-270}
        >
          <RadialBar
            background
            dataKey="count"
            cornerRadius={8}
            animationDuration={1500}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ fontSize: 12 }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition-colors duration-500">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">📊 Chart</h3>
      <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 text-center">
        <div>
          <div className="text-5xl mb-2">📈</div>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}
