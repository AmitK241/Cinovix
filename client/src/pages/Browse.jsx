import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getTrending, getByLanguage, getContinueWatching } from '../services/contentService';
import ContentRow from '../components/content/ContentRow';
import { useProfile } from '../context/ProfileContext';

function Browse() {
  const { user, logout } = useAuth();
  const { activeProfile, clearProfile } = useProfile();
  const navigate = useNavigate();

  const [trending, setTrending] = useState([]);
  const [bollywood, setBollywood] = useState([]);
  const [hollywood, setHollywood] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [trendingData, bollywoodData, hollywoodData, continueData] = await Promise.all([
          getTrending('movie'),
          getByLanguage('hi', 'movie'),
          getByLanguage('en', 'movie'),
          getContinueWatching(),
        ]);

        setTrending(trendingData);
        setBollywood(bollywoodData);
        setHollywood(hollywoodData);

        const mappedContinue = continueData.map((item) => ({
          id: item.tmdbId,
          title: item.title,
          poster_path: item.poster_path,
        }));
        setContinueWatching(mappedContinue);
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

  const handleSwitchProfile = () => {
    clearProfile();
    navigate('/profiles');
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading Cinovix...</div>;
  }

  return (
    <div style={{ backgroundColor: '#141414', color: 'white', minHeight: '100vh', paddingTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '20px' }}>
        <h1>Cinovix</h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/search" style={{ color: 'white', marginRight: '20px' }}>Search</Link>
          <Link to="/mylist" style={{ color: 'white', marginRight: '20px' }}>My List</Link>
          {activeProfile && (
            <img
              src={activeProfile.avatar}
              alt={activeProfile.name}
              onClick={handleSwitchProfile}
              style={{ width: '32px', height: '32px', borderRadius: '4px', marginRight: '10px', cursor: 'pointer' }}
              title="Switch Profile"
            />
          )}
          <span style={{ marginRight: '10px' }}>{user?.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <ContentRow title="Continue Watching" items={continueWatching} />
      <ContentRow title="Trending Now" items={trending} />
      <ContentRow title="Bollywood" items={bollywood} />
      <ContentRow title="Hollywood" items={hollywood} />
    </div>
  );
}

export default Browse;