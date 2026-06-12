import express from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// GET all workouts for user
router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM workouts WHERE user_id = ? ORDER BY workout_date DESC, created_at DESC')
    .all(req.userId);
  res.json(rows);
});

// POST a new workout — with PR detection
router.post('/', (req, res) => {
  const { exercise, sets, reps, weight, notes, workout_date } = req.body;
  if (!exercise || !sets || !reps)
    return res.status(400).json({ error: 'exercise, sets, reps required' });

  const currentMax = db
    .prepare('SELECT MAX(weight) as max FROM workouts WHERE user_id = ? AND exercise = ?')
    .get(req.userId, exercise).max || 0;

  const isPR = weight > currentMax && weight > 0;

  const stmt = db.prepare(`
    INSERT INTO workouts (user_id, exercise, sets, reps, weight, notes, workout_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    req.userId,
    exercise,
    sets,
    reps,
    weight || 0,
    notes || '',
    workout_date || new Date().toISOString().split('T')[0]
  );

  res.json({
    id: result.lastInsertRowid,
    isPR,
    previousMax: currentMax,
    newMax: weight,
    exercise,
  });
});

// GET stats + goals + streak
router.get('/stats', (req, res) => {
  const userId = req.userId;

  const totalWorkouts = db
    .prepare('SELECT COUNT(*) as c FROM workouts WHERE user_id = ?')
    .get(userId).c;

  const totalVolume = db
    .prepare('SELECT COALESCE(SUM(sets * reps * weight), 0) as v FROM workouts WHERE user_id = ?')
    .get(userId).v;

  const byExercise = db
    .prepare(`
      SELECT exercise, COUNT(*) as count, MAX(weight) as max_weight
      FROM workouts WHERE user_id = ?
      GROUP BY exercise ORDER BY count DESC
    `)
    .all(userId);

  const prsRows = db
    .prepare(`
      SELECT exercise, MAX(weight) as max_weight
      FROM workouts WHERE user_id = ? AND weight > 0
      GROUP BY exercise ORDER BY max_weight DESC
    `)
    .all(userId);
  const prs = prsRows.map((pr) => {
    const dateRow = db
      .prepare(`
        SELECT workout_date FROM workouts
        WHERE user_id = ? AND exercise = ? AND weight = ?
        ORDER BY workout_date DESC LIMIT 1
      `)
      .get(userId, pr.exercise, pr.max_weight);
    return { ...pr, achieved_at: dateRow?.workout_date || null };
  });

  // Weekly goal
  const userRow = db
    .prepare('SELECT weekly_goal FROM users WHERE id = ?')
    .get(userId);
  const weeklyGoal = userRow?.weekly_goal || 4;

  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - daysFromMonday);
  weekStart.setHours(0, 0, 0, 0);
  const weekStartStr = weekStart.toISOString().split('T')[0];

  const weeklyProgress = db
    .prepare(`
      SELECT COUNT(DISTINCT workout_date) as count
      FROM workouts
      WHERE user_id = ? AND workout_date >= ?
    `)
    .get(userId, weekStartStr).count;

  // Streak
  const workoutDates = db
    .prepare(`
      SELECT DISTINCT workout_date FROM workouts
      WHERE user_id = ?
      ORDER BY workout_date DESC
    `)
    .all(userId)
    .map((r) => r.workout_date);

  let currentStreak = 0;
  let bestStreak = 0;

  if (workoutDates.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let checkDate;
    if (workoutDates[0] === today) {
      checkDate = new Date();
      currentStreak = 1;
    } else if (workoutDates[0] === yesterday) {
      checkDate = new Date(Date.now() - 86400000);
      currentStreak = 1;
    }

    if (currentStreak > 0) {
      for (let i = 1; i < workoutDates.length; i++) {
        const expected = new Date(checkDate);
        expected.setDate(expected.getDate() - i);
        const expectedStr = expected.toISOString().split('T')[0];
        if (workoutDates[i] === expectedStr) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    let tempStreak = 1;
    bestStreak = 1;
    for (let i = 1; i < workoutDates.length; i++) {
      const prev = new Date(workoutDates[i - 1]);
      const curr = new Date(workoutDates[i]);
      const diffDays = Math.round((prev - curr) / 86400000);
      if (diffDays === 1) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
  }

  res.json({
    totalWorkouts,
    totalVolume,
    byExercise,
    prs,
    goal: {
      weekly: weeklyGoal,
      progress: weeklyProgress,
      percentage: Math.min(100, Math.round((weeklyProgress / weeklyGoal) * 100)),
    },
    streak: {
      current: currentStreak,
      best: Math.max(bestStreak, currentStreak),
    },
  });
});

// Update weekly goal
router.put('/goal', (req, res) => {
  const { weekly } = req.body;
  if (!weekly || weekly < 1 || weekly > 7)
    return res.status(400).json({ error: 'Weekly goal must be 1-7' });

  db.prepare('UPDATE users SET weekly_goal = ? WHERE id = ?')
    .run(weekly, req.userId);

  res.json({ success: true, weekly });
});

// DELETE a workout
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM workouts WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.userId);
  res.json({ success: true });
});

export default router;
