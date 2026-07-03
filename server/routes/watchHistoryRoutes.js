import express from 'express';
import { getWatchHistory, updateProgress, getProgressById } from '../controllers/watchHistoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getWatchHistory);
router.post('/', protect, updateProgress);
router.get('/:tmdbId', protect, getProgressById);

export default router;