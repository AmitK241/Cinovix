import { useState } from 'react';
import { createOrder, verifyPayment } from '../../services/subscriptionService';

function CheckoutModal({ plan, planName, price, onClose, onSuccess }) {
  const [step, setStep] = useState('card'); // card -> processing -> success
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');

    if (cardNumber.replace(/\s/g, '').length < 16) {
      setError('Enter a valid 16-digit card number');
      return;
    }

    setStep('processing');

    try {
      const { orderId } = await createOrder(plan);

      // Simulate network/processing delay like a real gateway
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await verifyPayment(orderId, plan);

      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError('Payment failed. Please try again.');
      setStep('card');
    }
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="glass-card aurora-border rounded-2xl w-full max-w-md p-6 relative">
        {step !== 'processing' && step !== 'success' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        )}

        {step === 'card' && (
          <>
            <p className="text-xs text-muted mb-1">Cinovix Secure Checkout</p>
            <h3 className="font-display text-xl font-bold text-white mb-1">{planName} Plan</h3>
            <p className="text-2xl font-bold text-aurora mb-6">₹{price}<span className="text-sm text-muted">/month</span></p>

            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="text-xs text-muted mb-1 block">Card Number</label>
                <input
                  type="text"
                  placeholder="4111 1111 1111 1111"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-white placeholder-muted/50 focus:outline-none focus:border-violet transition"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-muted mb-1 block">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    maxLength={5}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-white placeholder-muted/50 focus:outline-none focus:border-violet transition"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted mb-1 block">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={3}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-white placeholder-muted/50 focus:outline-none focus:border-violet transition"
                  />
                </div>
              </div>

              {error && <p className="text-magenta text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-violet via-magenta to-cyan hover:opacity-90 transition cursor-pointer"
              >
                Pay ₹{price}
              </button>

              <p className="text-xs text-muted text-center">
                🔒 This is a simulated checkout for demo purposes. No real payment is processed.
              </p>
            </form>
          </>
        )}

        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white/10 border-t-violet rounded-full animate-spin mb-4" />
            <p className="text-white/70 text-sm">Processing payment...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-12 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet to-cyan flex items-center justify-center mb-4 text-2xl">
              ✓
            </div>
            <p className="text-white font-semibold mb-1">Payment Successful</p>
            <p className="text-muted text-sm">{planName} plan activated</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;