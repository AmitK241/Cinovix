import {
  PLANS,
  generateMockOrderId,
  generateMockPaymentId,
  generateMockSignature,
  verifyMockSignature,
} from '../services/subscriptionService.js';
import User from '../models/User.js';

// @desc  Create a simulated order for chosen plan
// @route POST /api/subscription/create
export const initiateSubscription = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const orderId = generateMockOrderId();

    res.status(200).json({
      orderId,
      plan,
      amount: PLANS[plan].price,
      planName: PLANS[plan].name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Simulate payment verification and activate plan
// @route POST /api/subscription/verify
export const verifySubscriptionPayment = async (req, res) => {
  try {
    const { orderId, plan } = req.body;

    if (!PLANS[plan] && plan !== 'free') {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    // Simulate the gateway generating a payment ID + signature
    const paymentId = generateMockPaymentId();
    const signature = generateMockSignature(orderId, paymentId);

    // Simulate verifying it (this always passes since we generated it ourselves,
    // demonstrating the verification pattern used in real integrations)
    const isValid = verifyMockSignature(orderId, paymentId, signature);

    if (!isValid) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const user = await User.findById(req.user._id);
    user.subscriptionPlan = plan;
    user.subscriptionStatus = 'active';
    await user.save();
    await createNotification(req.user._id, {
      icon: '🎬',
      title: 'Subscription Activated',
      message: `Your ${plan} plan is now active. Enjoy premium features!`,
    });

    res.status(200).json({
      message: 'Subscription activated',
      plan,
      paymentId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Cancel current subscription
// @route POST /api/subscription/cancel
export const cancelUserSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.subscriptionPlan = 'free';
    user.subscriptionStatus = 'cancelled';
    await user.save();

    res.status(200).json({ message: 'Subscription cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get current subscription status
// @route GET /api/subscription/status
export const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      plan: user.subscriptionPlan,
      status: user.subscriptionStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};