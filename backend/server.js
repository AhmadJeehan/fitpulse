import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import workoutRoutes from './routes/workouts.js';

const app = express();
app.use(cors({
  origin: '*',  // Allow all origins (for now)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`💪 FitPulse API running on port ${PORT}`));
