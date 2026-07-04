import crypto from 'crypto';

// Simulated plan pricing (for display/reference)
export const PLANS = {
  basic: { name: 'Basic', price: 149, id: 'plan_basic_mock' },
  standard: { name: 'Standard', price: 299, id: 'plan_standard_mock' },
  premium: { name: 'Premium', price: 499, id: 'plan_premium_mock' },
};

// Generate a fake but realistic-looking subscription/order ID
export const generateMockOrderId = () => {
  return 'order_mock_' + crypto.randomBytes(8).toString('hex');
};

export const generateMockPaymentId = () => {
  return 'pay_mock_' + crypto.randomBytes(8).toString('hex');
};

// Simulate a signature the way a real gateway would produce one
export const generateMockSignature = (orderId, paymentId) => {
  const secret = process.env.JWT_SECRET; // reuse existing secret, no new key needed
  return crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
};

export const verifyMockSignature = (orderId, paymentId, signature) => {
  const expected = generateMockSignature(orderId, paymentId);
  return expected === signature;
};