import express from 'express';
import { getMyList, addToMyList, removeFromMyList } from '../controllers/myListController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyList);
router.post('/', protect, addToMyList);
router.delete('/:tmdbId', protect, removeFromMyList);

export default router;