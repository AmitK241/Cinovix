import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FAQS = [
  {
    question: 'What is Cinovix?',
    answer:
      'Cinovix is an AI-powered streaming platform that helps you discover movies and shows using personalized recommendations and natural language search — across Bollywood, Hollywood, and regional cinema.',
  },
  {
    question: 'Is Cinovix free to use?',
    answer:
      'Yes, Cinovix offers a free plan with full access to browsing, search, AI recommendations, and watchlists. Paid plans unlock higher streaming quality and more profiles.',
  },
  {
    question: 'How does the AI recommendation work?',
    answer:
      'Cinovix analyzes your watch history and saved titles using AI to understand your taste, then suggests content that matches your preferences — no generic top-10 lists.',
  },
  {
    question: 'Can I search using natural language?',
    answer:
      'Yes. Instead of exact titles, you can describe what you want — like "a sad emotional bollywood drama" — and Cinovix\'s AI search will understand and find matching content.',
  },
  {
    question: 'Can I create multiple profiles?',
    answer:
      'Yes, Cinovix supports up to 5 profiles per account, each with its own avatar, watch history, and personalized recommendations.',
  },
  {
    question: 'Which content libraries are supported?',
    answer:
      'Cinovix aggregates content information across Hollywood, Bollywood, Tollywood, Kollywood, Mollywood, Sandalwood, and more, along with availability on major streaming platforms.',
  },
];

function FAQItem({ faq, isOpen, onClick }) {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
      >
        <span className="text-white font-medium group-hover:text-cyan transition">
          {faq.question}
        </span>
        <span
          className={`text-white/50 text-xl transition-transform duration-300 flex-shrink-0 ml-4 ${
            isOpen ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-40 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
      </div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 md:px-12 py-6">
        <img
          src="/logo.png"
          alt="Cinovix"
          className="h-10 cursor-pointer"
          onClick={() => navigate('/')}
        />
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

      {/* FAQ Section */}
      <div className="px-6 md:px-12 pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-white/50 text-center mb-10">
            Everything you need to know about Cinovix
          </p>

          <div>
            {FAQS.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 md:px-12 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <img src="/logo.png" alt="Cinovix" className="h-8 mb-3" />
            <p className="text-white/40 text-xs leading-relaxed">
              AI-powered streaming platform that learns what you love.
            </p>
          </div>

          <div>
            <p className="text-white text-sm font-semibold mb-3">Product</p>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/login')} className="text-white/50 hover:text-cyan text-sm transition cursor-pointer">
                  Browse
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/login')} className="text-white/50 hover:text-cyan text-sm transition cursor-pointer">
                  AI Search
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/login')} className="text-white/50 hover:text-cyan text-sm transition cursor-pointer">
                  Subscription Plans
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-white text-sm font-semibold mb-3">Company</p>
            <ul className="space-y-2">
              <li><span className="text-white/50 text-sm">About</span></li>
              <li><span className="text-white/50 text-sm">Careers</span></li>
              <li><span className="text-white/50 text-sm">Contact</span></li>
            </ul>
          </div>

          <div>
            <p className="text-white text-sm font-semibold mb-3">Legal</p>
            <ul className="space-y-2">
              <li><span className="text-white/50 text-sm">Terms of Service</span></li>
              <li><span className="text-white/50 text-sm">Privacy Policy</span></li>
              <li><span className="text-white/50 text-sm">Cookie Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-5xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Cinovix. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Built with React, Node.js, MongoDB &amp; Groq AI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;