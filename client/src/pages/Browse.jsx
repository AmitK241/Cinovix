import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getTrending, getByLanguage, getContinueWatching } from '../services/contentService';
import { getRecommendations } from '../services/aiService';
import ContentRow from '../components/content/ContentRow';
import { useProfile } from '../context/ProfileContext';
import CategoryDropdown from '../components/navigation/CategoryDropdown';
import NotificationBell from '../components/navigation/NotificationBell';

function Browse() {
  const { user, logout } = useAuth();
  const { activeProfile, clearProfile } = useProfile();
  const navigate = useNavigate();

  const [trending, setTrending] = useState([]);
  const [bollywood, setBollywood] = useState([]);
  const [hollywood, setHollywood] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [tasteReason, setTasteReason] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [trendingData, bollywoodData, hollywoodData, continueData, aiData] = await Promise.all([
          getTrending('movie'),
          getByLanguage('hi', 'movie'),
          getByLanguage('en', 'movie'),
          getContinueWatching(),
          getRecommendations(),
        ]);

        setTrending(trendingData);
        setBollywood(bollywoodData);
        setHollywood(hollywoodData);

        const mappedContinue = continueData.map((item) => ({
          id: item.tmdbId,
          title: item.title,
          poster_path: item.posterPath,
        }));
        setContinueWatching(mappedContinue);

        setRecommended(aiData.results || []);
        setTasteReason(aiData.taste?.reasoning || '');
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-aurora font-display text-xl font-semibold animate-pulse">
          Loading Cinovix...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Navbar */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-base/70 border-b border-white/5">
        <div className="flex items-center justify-between px-6 md:px-12 py-4 flex-nowrap">
          <img
            src="/logo.png"
            alt="Cinovix"
            onClick={() => navigate('/browse')}
            className="h-9 cursor-pointer flex-shrink-0"
          />

          <div className="flex items-center gap-4 md:gap-6 flex-nowrap flex-shrink-0">
            <CategoryDropdown />
            <Link to="/search" className="text-white/80 hover:text-white text-sm font-medium transition whitespace-nowrap">
              Search
            </Link>
            <Link to="/mylist" className="text-white/80 hover:text-white text-sm font-medium transition whitespace-nowrap">
              My List
            </Link>
            <NotificationBell />
            <Link to="/subscription" className="text-white/80 hover:text-white text-sm font-medium transition whitespace-nowrap">
              Upgrade
            </Link>
            {activeProfile && (
              <img
                src={activeProfile.avatar}
                alt={activeProfile.name}
                onClick={handleSwitchProfile}
                title="Switch Profile"
                className="w-8 h-8 rounded-md cursor-pointer border border-white/10 hover:border-violet transition flex-shrink-0"
              />
            )}
            <span className="text-muted text-sm hidden lg:inline whitespace-nowrap">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-md text-sm font-medium text-white/90 border border-white/15 hover:border-magenta hover:text-magenta hover:bg-magenta/10 transition cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="pt-8">
        {recommended.length > 0 && (
          <div className="px-6 md:px-12 mb-2">
            <div className="aurora-border glass-card rounded-xl p-4 mb-6">
              <p className="text-sm text-white/80">
                <span className="text-cyan font-medium">✨ AI Insight:</span> {tasteReason}
              </p>
            </div>
          </div>
        )}

        <ContentRow title="Recommended for You" items={recommended} highlight />
        <ContentRow title="Continue Watching" items={continueWatching} />
        <ContentRow title="Trending Now" items={trending} />
        <ContentRow title="Bollywood" items={bollywood} />
        <ContentRow title="Hollywood" items={hollywood} />
      </div>
    </div>
  );
}

export default Browse;