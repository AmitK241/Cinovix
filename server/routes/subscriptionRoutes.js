import express from 'express';
import {
  initiateSubscription,
  verifySubscriptionPayment,
  cancelUserSubscription,
  getSubscriptionStatus,
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, initiateSubscription);
router.post('/verify', protect, verifySubscriptionPayment);
router.post('/cancel', protect, cancelUserSubscription);
router.get('/status', protect, getSubscriptionStatus);

export default router;