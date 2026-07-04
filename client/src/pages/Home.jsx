import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 md:px-12 py-6">
        <h1 className="font-display text-2xl font-bold text-aurora">Cinovix</h1>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet to-magenta hover:opacity-90 transition cursor-pointer"
        >
          Sign In
        </button>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="aurora-border glass-card rounded-full px-4 py-1.5 mb-6">
          <p className="text-xs font-medium text-cyan">✨ Powered by AI</p>
        </div>

        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-4xl leading-tight">
          Streaming that{' '}
          <span className="text-aurora">thinks with you</span>
        </h2>

        <p className="text-white/60 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
          Cinovix learns your taste and finds what to watch next — powered by
          AI recommendations and natural language search, across Bollywood,
          Hollywood, and beyond.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3.5 rounded-lg text-base font-semibold text-white bg-gradient-to-r from-violet via-magenta to-cyan hover:opacity-90 transition cursor-pointer shadow-lg shadow-violet/30"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3.5 rounded-lg text-base font-semibold text-white/80 border border-white/15 hover:border-white/30 hover:text-white transition cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Feature strip */}
      <div className="px-6 md:px-12 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card rounded-xl p-6">
            <p className="text-2xl mb-3">🎯</p>
            <h3 className="font-display text-white font-semibold mb-2">AI Recommendations</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Your watch history shapes what's suggested next — no generic top-10 lists.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <p className="text-2xl mb-3">💬</p>
            <h3 className="font-display text-white font-semibold mb-2">Natural Language Search</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Search how you'd describe it to a friend — "a sad emotional drama" just works.
            </p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <p className="text-2xl mb-3">🌏</p>
            <h3 className="font-display text-white font-semibold mb-2">Global Content</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Bollywood, Hollywood, and regional cinema — all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;