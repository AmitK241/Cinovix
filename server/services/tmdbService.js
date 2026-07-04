import axios from 'axios';

console.log('TMDB KEY:', process.env.TMDB_API_KEY);   // ← ye line add karo

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
});

// Trending movies/shows (all languages)
export const getTrending = async (mediaType = 'movie') => {
  const response = await tmdbApi.get(`/trending/${mediaType}/week`);
  return response.data.results;
};

// Popular content filtered by language (e.g. 'hi' for Bollywood, 'te' for Telugu)
export const getPopularByLanguage = async (language = 'en', mediaType = 'movie') => {
  const response = await tmdbApi.get(`/discover/${mediaType}`, {
    params: {
      with_original_language: language,
      sort_by: 'popularity.desc',
    },
  });
  return response.data.results;
};

// Get by genre
export const getByGenre = async (genreId, mediaType = 'movie') => {
  const response = await tmdbApi.get(`/discover/${mediaType}`, {
    params: {
      with_genres: genreId,
      sort_by: 'popularity.desc',
    },
  });
  return response.data.results;
};

// Search
export const searchContent = async (query, mediaType = 'movie') => {
  const response = await tmdbApi.get(`/search/${mediaType}`, {
    params: { query },
  });
  return response.data.results;
};

// Get details by ID (for Watch page)
export const getDetailsById = async (id, mediaType = 'movie') => {
  const response = await tmdbApi.get(`/${mediaType}/${id}`, {
    params: {
      append_to_response: 'videos,credits',
      include_video_language: 'null',
    },
  });
  return response.data;
};
// Discover movies by genre name + optional keyword
export const discoverByMood = async (genreNames, language = null, mediaType = 'movie') => {
  const genreMap = {
    Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80,
    Documentary: 99, Drama: 18, Family: 10751, Fantasy: 14, History: 36,
    Horror: 27, Music: 10402, Mystery: 9648, Romance: 10749,
    'Science Fiction': 878, Thriller: 53, War: 10752,
  };

  const genreIds = genreNames
    .map((name) => genreMap[name])
    .filter(Boolean)
    .join(',');

  const params = {
    with_genres: genreIds,
    sort_by: 'popularity.desc',
  };

  if (language) {
    params.with_original_language = language;
  }

  const response = await tmdbApi.get(`/discover/${mediaType}`, { params });
  return response.data.results;
};