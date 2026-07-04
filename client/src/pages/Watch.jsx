import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getDetails,
  addToMyList,
  removeFromMyList,
  getMyList,
  updateProgress,
  getProgressById,
  getSimilarMovies,
} from '../services/contentService';
import TitleCard from '../components/content/TitleCard';

function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inMyList, setInMyList] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null);
  const [similar, setSimilar] = useState([]);

  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getDetails(id, 'movie');
        setContent(data);

        const myList = await getMyList();
        setInMyList(myList.some((item) => item.tmdbId === Number(id)));

        const progress = await getProgressById(id);
        setSavedProgress(progress);

        const similarData = await getSimilarMovies(id, 'movie');
        setSimilar(similarData);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const trailer =
    content?.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ||
    content?.videos?.results?.find((v) => v.type === 'Teaser' && v.site === 'YouTube');

  useEffect(() => {
    if (!trailer) return;

    const createPlayer = () => {
      playerRef.current = new window.YT.Player('yt-player', {
        videoId: trailer.key,
        events: {
          onReady: (event) => {
            if (savedProgress?.progressSeconds) {
              event.target.seekTo(savedProgress.progressSeconds, true);
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              clearInterval(intervalRef.current);
              intervalRef.current = setInterval(saveProgress, 10000);
            } else {
              clearInterval(intervalRef.current);
              if (
                event.data === window.YT.PlayerState.PAUSED ||
                event.data === window.YT.PlayerState.ENDED
              ) {
                saveProgress();
              }
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      clearInterval(intervalRef.current);
      saveProgress();
    };
  }, [trailer, savedProgress]);

  const saveProgress = async () => {
    if (!playerRef.current || !content) return;
    try {
      const progressSeconds = Math.floor(playerRef.current.getCurrentTime());
      const durationSeconds = Math.floor(playerRef.current.getDuration());

      if (progressSeconds <= 0) return;

      await updateProgress({
        tmdbId: Number(id),
        mediaType: 'movie',
        title: content.title,
        poster_path: content.poster_path,
        progressSeconds,
        durationSeconds,
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleMyListToggle = async () => {
    setListLoading(true);
    try {
      if (inMyList) {
        await removeFromMyList(id);
        setInMyList(false);
      } else {
        await addToMyList({
          tmdbId: Number(id),
          mediaType: 'movie',
          title: content.title,
          poster_path: content.poster_path,
        });
        setInMyList(true);
      }
    } catch (error) {
      console.error('My List error:', error);
    } finally {
      setListLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-aurora font-display text-xl font-semibold animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Content not found</p>
      </div>
    );
  }

  const cast = content.credits?.cast?.slice(0, 6) || [];
  const backdropUrl = content.backdrop_path
    ? `https://image.tmdb.org/t/p/original${content.backdrop_path}`
    : content.poster_path
    ? `https://image.tmdb.org/t/p/original${content.poster_path}`
    : null;
  const year = content.release_date?.split('-')[0];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero backdrop */}
      <div className="relative w-full h-[65vh] min-h-[420px]">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={content.title}
            className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-base from-10% via-base/70 via-50% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-base/90 via-base/20 to-transparent" />

        <img
          src="/logo.png"
          alt="Cinovix"
          onClick={() => navigate('/browse')}
          className="absolute top-6 left-6 h-9 cursor-pointer opacity-90 hover:opacity-100 transition"
        />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md ring-1 ring-white/10 text-white text-sm font-medium hover:bg-black/60 transition cursor-pointer"
        >
          ← Back
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-10">
          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-violet via-magenta to-cyan mb-4" />

          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 max-w-2xl drop-shadow-lg">
            {content.title}
          </h1>

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {year && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80 ring-1 ring-white/10">
                {year}
              </span>
            )}
            {content.runtime > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80 ring-1 ring-white/10">
                {content.runtime} min
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400/15 text-yellow-400 ring-1 ring-yellow-400/20">
              ★ {content.vote_average?.toFixed(1)}
            </span>
          </div>

          <button
            onClick={handleMyListToggle}
            disabled={listLoading}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer disabled:opacity-50 shadow-lg ${
              inMyList
                ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                : 'bg-gradient-to-r from-violet via-magenta to-cyan text-white hover:opacity-90 shadow-violet/30'
            }`}
          >
            {listLoading ? 'Please wait...' : inMyList ? '✓ In My List' : '+ Add to My List'}
          </button>
        </div>
      </div>

      {/* Content section */}
      <div className="px-6 md:px-12 pt-10 max-w-4xl">
        {trailer ? (
          <div className="mb-10">
            <h3 className="font-display text-xl font-semibold text-white mb-4">Trailer</h3>
            <div className="aurora-border rounded-xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
              <div id="yt-player" className="aspect-video w-full bg-surface" />
            </div>
            {savedProgress?.progressSeconds > 0 && (
              <p className="text-cyan text-xs mt-3">▶ Resuming from where you left off</p>
            )}
          </div>
        ) : (
          <div className="mb-10 p-6 rounded-xl bg-surface ring-1 ring-white/5">
            <p className="text-muted mb-3">Trailer not available on TMDB</p>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(content.title + ' official trailer')}`}
              target="_blank"
              rel="noreferrer"
              className="text-cyan font-medium hover:underline"
            >
              Search on YouTube →
            </a>
          </div>
        )}

        <h3 className="font-display text-xl font-semibold text-white mb-3">Overview</h3>
        <p className="text-white/70 leading-relaxed mb-8">{content.overview}</p>

        {content.genres?.length > 0 && (
          <div className="mb-10">
            <h3 className="font-display text-xl font-semibold text-white mb-3">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {content.genres.map((g, i) => {
                const colors = ['from-violet to-magenta', 'from-magenta to-cyan', 'from-cyan to-violet'];
                return (
                  <span
                    key={g.id}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${colors[i % 3]} opacity-90`}
                  >
                    {g.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {cast.length > 0 && (
          <div>
            <h3 className="font-display text-xl font-semibold text-white mb-4">Cast</h3>
            <div className="flex gap-5 flex-wrap">
              {cast.map((actor) => (
                <div key={actor.id} className="text-center w-24 group">
                  <div className="rounded-lg overflow-hidden ring-1 ring-white/10 group-hover:ring-violet/50 mb-2 aspect-[2/3] transition">
                    <img
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                          : 'https://via.placeholder.com/200x300/16141F/8B8B96?text=No+Image'
                      }
                      alt={actor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <p className="text-xs text-white/70 truncate">{actor.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {similar.length > 0 && (
        <div className="mt-14">
          <h3 className="font-display text-xl font-semibold text-white mb-4">More Like This</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-10">
            {similar.slice(0, 12).map((item) => (
              <TitleCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Watch;