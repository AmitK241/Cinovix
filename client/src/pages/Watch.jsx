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
import ReviewSection from '../components/content/ReviewSection';

const ASSUMED_TRAILER_DURATION = 180; // approx seconds, used only for continue-watching progress bar math

function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inMyList, setInMyList] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [similar, setSimilar] = useState([]);

  const elapsedRef = useRef(0);
  const contentRef = useRef(null);
  const idRef = useRef(id);

  useEffect(() => {
    idRef.current = id;
  }, [id]);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    setLoading(true);
    setContent(null);
    setSimilar([]);
    setSavedProgress(null);
    setProgressLoaded(false);
    elapsedRef.current = 0;

    const fetchDetails = async () => {
      try {
        const data = await getDetails(id, 'movie');
        setContent(data);

        const myList = await getMyList();
        setInMyList(myList.some((item) => item.tmdbId === Number(id)));

        const progress = await getProgressById(id);
        setSavedProgress(progress);
        elapsedRef.current = progress?.progressSeconds || 0;
        setProgressLoaded(true);

        const similarData = await getSimilarMovies(id, 'movie');
        setSimilar(similarData);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo(0, 0);
  }, [id]);

  // Pick the best available YouTube video: Trailer > Teaser > Clip > Featurette
  const trailer = (() => {
    if (!content?.videos?.results) return null;
    const results = content.videos.results.filter((v) => v.site === 'YouTube');
    const priority = ['Trailer', 'Teaser', 'Clip', 'Featurette'];
    const sorted = results
      .slice()
      .sort((a, b) => priority.indexOf(a.type) - priority.indexOf(b.type))
      .filter((v) => priority.includes(v.type));
    return sorted[0] || null;
  })();

  // Approximate progress tracking using real timestamps for second-accurate results,
  // with an immediate save on cleanup so leaving early (even <10s) is captured exactly.
  // Waits for progressLoaded so it always starts from the correct saved base, not 0.
  useEffect(() => {
    if (!trailer || !progressLoaded) return;

    const baseElapsed = savedProgress?.progressSeconds || 0;
    const startTime = Date.now();

    const getCurrentElapsed = () => baseElapsed + Math.floor((Date.now() - startTime) / 1000);

    const doSave = () => {
      const currentContent = contentRef.current;
      const currentId = idRef.current;
      if (!currentContent) return;

      const current = getCurrentElapsed();
      elapsedRef.current = current;

      updateProgress({
        tmdbId: Number(currentId),
        mediaType: 'movie',
        title: currentContent.title,
        poster_path: currentContent.poster_path,
        progressSeconds: current,
        durationSeconds: ASSUMED_TRAILER_DURATION,
      }).catch((error) => console.error('Error saving progress:', error));
    };

    const save = setInterval(doSave, 10000);

    return () => {
      clearInterval(save);
      doSave(); // final flush with the exact elapsed time at the moment of leaving
    };
  }, [trailer, id, progressLoaded]);

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
  const startSeconds = Math.floor(savedProgress?.progressSeconds || 0);

  return (
    <div className="min-h-screen pb-20">
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

      <div className="px-6 md:px-12 pt-10">
        {trailer ? (
          <div className="mb-10 max-w-4xl">
            <h3 className="font-display text-xl font-semibold text-white mb-4">Trailer</h3>
            <div className="aurora-border rounded-xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
              <iframe
                key={trailer.key}
                src={`https://www.youtube.com/embed/${trailer.key}?start=${startSeconds}`}
                title="Trailer"
                className="aspect-video w-full bg-surface"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {startSeconds > 0 && (
              <p className="text-cyan text-xs mt-3">▶ Resuming from where you left off</p>
            )}
          </div>
        ) : (
          <div className="mb-10 p-6 rounded-xl bg-surface ring-1 ring-white/5 max-w-4xl">
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

        <div className="max-w-3xl">
          <h3 className="font-display text-xl font-semibold text-white mb-3">Overview</h3>
          <p className="text-white/70 leading-relaxed mb-8">{content.overview}</p>
        </div>

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
                          : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"%3E%3Crect width="200" height="300" fill="%2316141F"/%3E%3Ctext x="50%25" y="50%25" font-size="14" fill="%238B8B96" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
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

        <ReviewSection tmdbId={id} mediaType="movie" />

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