import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import myListRoutes from './routes/myListRoutes.js';
import watchHistoryRoutes from './routes/watchHistoryRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Cinovix API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/mylist', myListRoutes);
app.use('/api/watch-history', watchHistoryRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/subscription', subscriptionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});