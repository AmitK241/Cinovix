import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getTrending, getByLanguage } from '../services/contentService';
import ContentRow from '../components/content/ContentRow';

function Browse() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [trending, setTrending] = useState([]);
  const [bollywood, setBollywood] = useState([]);
  const [hollywood, setHollywood] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [trendingData, bollywoodData, hollywoodData] = await Promise.all([
          getTrending('movie'),
          getByLanguage('hi', 'movie'),
          getByLanguage('en', 'movie'),
        ]);

        setTrending(trendingData);
        setBollywood(bollywoodData);
        setHollywood(hollywoodData);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading Cinovix...</div>;
  }

  return (
    <div style={{ backgroundColor: '#141414', color: 'white', minHeight: '100vh', paddingTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '20px' }}>
        <h1>Cinovix</h1>
        <div>
          <span style={{ marginRight: '10px' }}>{user?.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <ContentRow title="Trending Now" items={trending} />
      <ContentRow title="Bollywood" items={bollywood} />
      <ContentRow title="Hollywood" items={hollywood} />
    </div>
  );
}

export default Browse;