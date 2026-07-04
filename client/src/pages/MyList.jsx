import { useEffect, useState } from 'react';
import { getMyList } from '../services/contentService';
import { Link, useNavigate } from 'react-router-dom';
import TitleCard from '../components/content/TitleCard';

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

  // Map to TitleCard expected shape
  const mappedList = list.map((item) => ({
    id: item.tmdbId,
    title: item.title,
    poster_path: item.poster_path,
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-aurora font-display text-xl font-semibold animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Navbar */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-base/70 border-b border-white/5">
        <div className="flex items-center justify-between px-6 md:px-12 py-4">
          <h1
            onClick={() => navigate('/browse')}
            className="font-display text-2xl font-bold text-aurora cursor-pointer"
          >
            Cinovix
          </h1>
          <Link to="/browse" className="text-white/80 hover:text-white text-sm font-medium transition">
            ← Back to Browse
          </Link>
        </div>
      </div>

      <div className="px-6 md:px-12 pt-10">
        <h2 className="font-display text-3xl font-bold text-white mb-8">My List</h2>

        {mappedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4 ring-1 ring-white/10">
              <span className="text-2xl">🎬</span>
            </div>
            <p className="text-white/90 font-medium mb-1">Your list is empty</p>
            <p className="text-muted text-sm mb-6 max-w-xs">
              Save movies and shows you want to watch later — they'll show up right here.
            </p>
            <Link
              to="/browse"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet to-magenta hover:opacity-90 transition"
            >
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10">
            {mappedList.map((item) => (
              <TitleCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyList;