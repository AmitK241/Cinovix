import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getByLanguage, getByProvider } from '../services/contentService';
import TitleCard from '../components/content/TitleCard';

function Category() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const type = searchParams.get('type');
  const value = searchParams.get('value');
  const label = searchParams.get('label') || 'Results';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data =
          type === 'provider'
            ? await getByProvider(value, 'movie')
            : await getByLanguage(value, 'movie');
        setResults(data);
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [type, value]);

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

      <div className="px-6 md:px-12 pt-10">
        <h2 className="font-display text-3xl font-bold text-white mb-8">{label}</h2>

        {loading ? (
          <p className="text-muted animate-pulse">Loading...</p>
        ) : results.length === 0 ? (
          <p className="text-muted">No results found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10">
            {results.map((item) => (
              <TitleCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Category;