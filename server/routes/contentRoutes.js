import express from 'express';
import {
  trending,
  byLanguage,
  byGenre,
  search,
  details,
  similar,
  providers,
  byProvider,
} from '../controllers/contentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/trending', protect, trending);
router.get('/language', protect, byLanguage);
router.get('/genre', protect, byGenre);
router.get('/search', protect, search);
router.get('/providers', protect, providers);
router.get('/by-provider', protect, byProvider);
router.get('/:id/similar', protect, similar);
router.get('/:id', protect, details);

export default router;