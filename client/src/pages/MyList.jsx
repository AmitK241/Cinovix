import { useEffect, useState } from 'react';
import { getMyList } from '../services/contentService';
import { useNavigate } from 'react-router-dom';

function MyList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchList = async () => {
      try {
        const data = await getMyList();
        setList(data);
      } catch (error) {
        console.error('Error fetching My List:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', color: 'white', backgroundColor: '#141414', minHeight: '100vh' }}>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: '#141414', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <h1>My List</h1>

      {list.length === 0 ? (
        <p>Your list is empty. Add movies from the Watch page!</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '16px',
          }}
        >
          {list.map((item) => (
            <div
              key={item.tmdbId}
              onClick={() => navigate(`/watch/${item.tmdbId}`)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                    : 'https://via.placeholder.com/300x450?text=No+Image'
                }
                alt={item.title}
                style={{ width: '100%', borderRadius: '4px' }}
              />
              <p style={{ fontSize: '13px', marginTop: '4px' }}>{item.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyList;