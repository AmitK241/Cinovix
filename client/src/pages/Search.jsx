import { useState, useEffect } from 'react';
import { searchContent } from '../services/contentService';
import useDebounce from '../hooks/useDebounce';
import TitleCard from '../components/content/TitleCard';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await searchContent(debouncedQuery, 'movie');
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div style={{ backgroundColor: '#141414', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <h1>Search</h1>
      <input
        type="text"
        placeholder="Search for movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '12px',
          fontSize: '16px',
          marginBottom: '20px',
        }}
      />

      {loading && <p>Searching...</p>}

      {!loading && debouncedQuery && results.length === 0 && (
        <p>No results found for "{debouncedQuery}"</p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '16px',
        }}
      >
        {results.map((item) => (
          <TitleCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Search;