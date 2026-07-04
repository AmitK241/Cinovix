import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchContent } from '../services/contentService';
import { semanticSearch } from '../services/aiService';
import useDebounce from '../hooks/useDebounce';
import TitleCard from '../components/content/TitleCard';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');

  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setAiExplanation('');
        return;
      }

      setLoading(true);
      try {
        if (aiMode) {
          const data = await semanticSearch(debouncedQuery);
          setResults(data.results);
          setAiExplanation(
            `${data.parsed.keywords} • ${data.parsed.genres.join(', ')} • ${data.parsed.mood} mood`
          );
        } else {
          const data = await searchContent(debouncedQuery, 'movie');
          setResults(data);
          setAiExplanation('');
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, aiMode]);

  return (
    <div className="min-h-screen pb-16">
      {/* Navbar */}
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

      <div className="px-6 md:px-12 pt-10 max-w-3xl">
        <h2 className="font-display text-3xl font-bold text-white mb-6">Search</h2>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder={aiMode ? 'Try: "a sad emotional bollywood movie"' : 'Search for movies...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-surface border border-white/10 text-white placeholder-muted focus:outline-none focus:border-violet transition"
          />

          <button
            onClick={() => setAiMode(!aiMode)}
            className={`px-5 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
              aiMode
                ? 'bg-gradient-to-r from-violet to-cyan text-white shadow-glow-cyan'
                : 'bg-surface border border-white/10 text-white/70 hover:border-white/30'
            }`}
          >
            {aiMode ? '✨ AI Search: ON' : 'AI Search: OFF'}
          </button>
        </div>

        {aiExplanation && (
          <div className="aurora-border glass-card rounded-lg px-4 py-2.5 mb-6 inline-block">
            <p className="text-sm text-cyan">{aiExplanation}</p>
          </div>
        )}

        {loading && (
          <p className="text-muted text-sm mb-6 animate-pulse">Searching...</p>
        )}

        {!loading && debouncedQuery && results.length === 0 && (
          <p className="text-muted text-sm mb-6">No results found for "{debouncedQuery}"</p>
        )}
      </div>

      <div className="px-6 md:px-12 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10">
          {results.map((item) => (
            <TitleCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Search;