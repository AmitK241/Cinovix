import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getDetails,
  addToMyList,
  removeFromMyList,
  getMyList,
  updateProgress,
  getProgressById,
} from '../services/contentService';

function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inMyList, setInMyList] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null);

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

  // Load YouTube IFrame API and create player once trailer + content are ready
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
    return <div style={{ padding: '20px', color: 'white', backgroundColor: '#141414', minHeight: '100vh' }}>Loading...</div>;
  }

  if (!content) {
    return <div style={{ padding: '20px', color: 'white', backgroundColor: '#141414', minHeight: '100vh' }}>Content not found</div>;
  }

  const cast = content.credits?.cast?.slice(0, 6) || [];

  return (
    <div style={{ backgroundColor: '#141414', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        ← Back
      </button>

      <h1>{content.title}</h1>
      <p style={{ opacity: 0.7 }}>
        {content.release_date?.split('-')[0]} • {content.runtime} min • ⭐ {content.vote_average?.toFixed(1)}
      </p>

      <button onClick={handleMyListToggle} disabled={listLoading} style={{ margin: '10px 0', padding: '8px 16px' }}>
        {listLoading ? 'Please wait...' : inMyList ? '✓ Remove from My List' : '+ Add to My List'}
      </button>

      {trailer ? (
        <div style={{ margin: '20px 0', maxWidth: '800px' }}>
          <div id="yt-player"></div>
          {savedProgress?.progressSeconds > 0 && (
            <p style={{ fontSize: '13px', opacity: 0.6 }}>Resuming from where you left off</p>
          )}
        </div>
      ) : (
        <div style={{ margin: '20px 0' }}>
          <p style={{ opacity: 0.6 }}>Trailer not available on TMDB</p>
          
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(content.title + ' official trailer')}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#e50914' }}
          <a>
            Search on YouTube →
          </a>
        </div>
      )}

      <h3>Overview</h3>
      <p style={{ maxWidth: '700px' }}>{content.overview}</p>

      <h3 style={{ marginTop: '20px' }}>Genres</h3>
      <p>{content.genres?.map((g) => g.name).join(', ')}</p>

      {cast.length > 0 && (
        <>
          <h3 style={{ marginTop: '20px' }}>Cast</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {cast.map((actor) => (
              <div key={actor.id} style={{ textAlign: 'center', width: '100px' }}>
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : 'https://via.placeholder.com/100x150?text=No+Image'
                  }
                  alt={actor.name}
                  style={{ width: '100%', borderRadius: '4px' }}
                />
                <p style={{ fontSize: '12px', marginTop: '4px' }}>{actor.name}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Watch;