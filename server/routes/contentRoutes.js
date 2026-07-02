import express from 'express';
import {
  trending,
  byLanguage,
  byGenre,
  search,
  details,
} from '../controllers/contentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/trending', protect, trending);
router.get('/language', protect, byLanguage);
router.get('/genre', protect, byGenre);
router.get('/search', protect, search);
router.get('/:id', protect, details);

export default router;