import express from 'express';
import { getReviews, upsertReview, deleteReview, getMyReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:tmdbId/mine', protect, getMyReview);
router.get('/:tmdbId', protect, getReviews);
router.post('/', protect, upsertReview);
router.delete('/:tmdbId', protect, deleteReview);

export default router;