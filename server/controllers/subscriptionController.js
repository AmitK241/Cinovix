import User from '../models/User.js';
import {
  PLANS,
  generateMockOrderId,
  generateMockPaymentId,
  generateMockSignature,
  verifyMockSignature,
} from '../services/subscriptionService.js';
import { createNotification } from '../services/notificationService.js';

export const initiateSubscription = async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ message: 'Invalid plan' });

    const orderId = generateMockOrderId();
    const paymentId = generateMockPaymentId();
    const signature = generateMockSignature(orderId, paymentId);

    res.json({ orderId, paymentId, signature, plan, amount: PLANS[plan].price });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifySubscriptionPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature, plan } = req.body;

    if (!verifyMockSignature(orderId, paymentId, signature))
      return res.status(400).json({ message: 'Payment verification failed' });

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'subscription.plan': plan, 'subscription.status': 'active', 'subscription.expiresAt': expiresAt, 'subscription.orderId': orderId },
      { new: true }
    );

    await createNotification(req.user._id, {
      icon: '🎉',
      title: 'Subscription Activated',
      message: `Your ${PLANS[plan].name} plan is now active until ${expiresAt.toLocaleDateString()}.`,
    });

    res.json({ message: 'Subscription activated', subscription: user.subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelUserSubscription = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'subscription.status': 'cancelled' },
      { new: true }
    );

    await createNotification(req.user._id, {
      icon: '📭',
      title: 'Subscription Cancelled',
      message: 'Your subscription has been cancelled. You can resubscribe anytime.',
    });

    res.json({ message: 'Subscription cancelled', subscription: user.subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('subscription');
    res.json(user.subscription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
