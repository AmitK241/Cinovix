import express from 'express';
import {
  getNotifications,
  markAllRead,
  dismissNotification,
  clearAllNotifications,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.patch('/read-all', protect, markAllRead);
router.delete('/:id', protect, dismissNotification);
router.delete('/', protect, clearAllNotifications);

export default router;