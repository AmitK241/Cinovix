import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSubscriptionStatus, cancelSubscription } from '../services/subscriptionService';
import CheckoutModal from '../components/subscription/CheckoutModal';

const PLANS = [
  { id: 'basic', name: 'Basic', price: 149, features: ['720p streaming', '1 profile', 'Watch on 1 device'] },
  { id: 'standard', name: 'Standard', price: 299, features: ['1080p streaming', '3 profiles', 'Watch on 2 devices'], popular: true },
  { id: 'premium', name: 'Premium', price: 499, features: ['4K + HDR streaming', '5 profiles', 'Watch on 4 devices'] },
];

function Subscription() {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStatus = async () => {
    try {
      const data = await getSubscriptionStatus();
      setCurrentPlan(data.plan);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleCancel = async () => {
    if (!confirm('Cancel your subscription?')) return;
    try {
      await cancelSubscription();
      fetchStatus();
    } catch (error) {
      console.error('Error cancelling:', error);
    }
  };

  const handleSuccess = () => {
    setSelectedPlan(null);
    fetchStatus();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-aurora font-display text-xl font-semibold animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-20 backdrop-blur-md bg-base/70 border-b border-white/5">
        <div className="flex items-center justify-between px-6 md:px-12 py-4">
          <img
            src="/logo.png"
            alt="Cinovix"
            onClick={() => navigate('/browse')}
            className="h-9 cursor-pointer"
          />
          <Link to="/browse" className="text-white/80 hover:text-white text-sm font-medium transition">
            ← Back to Browse
          </Link>
        </div>
      </div>

      <div className="px-6 md:px-12 pt-14 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
          Choose your plan
        </h2>
        <p className="text-muted mb-2">
          Current plan: <span className="text-cyan font-semibold capitalize">{currentPlan}</span>
        </p>
        {currentPlan !== 'free' && (
          <button
            onClick={handleCancel}
            className="text-magenta text-sm hover:underline cursor-pointer"
          >
            Cancel subscription
          </button>
        )}
      </div>

      <div className="px-6 md:px-12 pt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl p-6 flex flex-col ${
              plan.popular
                ? 'aurora-border glass-card scale-105'
                : 'bg-surface ring-1 ring-white/10'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-violet to-magenta text-white">
                Most Popular
              </span>
            )}

            <h3 className="font-display text-xl font-bold text-white mb-1">{plan.name}</h3>
            <p className="text-3xl font-bold text-white mb-4">
              ₹{plan.price}<span className="text-sm text-muted font-normal">/month</span>
            </p>

            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="text-white/70 text-sm flex items-center gap-2">
                  <span className="text-cyan">✓</span> {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setSelectedPlan(plan)}
              disabled={currentPlan === plan.id}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer disabled:opacity-50 ${
                plan.popular
                  ? 'bg-gradient-to-r from-violet to-magenta text-white hover:opacity-90'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {currentPlan === plan.id ? '✓ Current Plan' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <CheckoutModal
          plan={selectedPlan.id}
          planName={selectedPlan.name}
          price={selectedPlan.price}
          onClose={() => setSelectedPlan(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default Subscription;