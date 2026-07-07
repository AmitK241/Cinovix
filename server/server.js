import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import myListRoutes from './routes/myListRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import watchHistoryRoutes from './routes/watchHistoryRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://cinovix.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json());

// ── Root + Health check ───────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Cinovix API is running...');
});

app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/mylist', myListRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/watch-history', watchHistoryRoutes);

// ── MongoDB connection ────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    startServer(PORT);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ── Dynamic port fallback ─────────────────────────────────────────────────────
function startServer(port, attempts = 0) {
  if (attempts >= 10) {
    console.error('❌ Could not find a free port after 10 attempts. Exiting.');
    process.exit(1);
  }

  const server = app.listen(port, () => {
    console.log(`🚀 Cinovix server running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Port ${port} is in use — trying port ${port + 1}...`);
      server.close(() => startServer(port + 1, attempts + 1));
    } else {
      console.error('❌ Server error:', err.message);
      process.exit(1);
    }
  });
}