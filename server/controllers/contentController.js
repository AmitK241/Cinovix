import {
  getTrending,
  getPopularByLanguage,
  getByGenre,
  searchContent,
  getDetailsById,
  getSimilarMovies,
  getWatchProviders,
  discoverByProvider,
} from '../services/tmdbService.js';

export const trending = async (req, res) => {
  try {
    const { mediaType, type } = req.query;
    const data = await getTrending(mediaType || type || 'movie');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const byLanguage = async (req, res) => {
  try {
    const { language = 'en', mediaType, type } = req.query;
    const data = await getPopularByLanguage(language, mediaType || type || 'movie');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const byGenre = async (req, res) => {
  try {
    const { genreId, mediaType, type } = req.query;
    const data = await getByGenre(genreId, mediaType || type || 'movie');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const search = async (req, res) => {
  try {
    const { query, mediaType, type } = req.query;
    const data = await searchContent(query, mediaType || type || 'movie');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const details = async (req, res) => {
  try {
    const { id } = req.params;
    const { mediaType, type } = req.query;
    const data = await getDetailsById(id, mediaType || type || 'movie');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const similar = async (req, res) => {
  try {
    const { id } = req.params;
    const { mediaType, type } = req.query;
    const data = await getSimilarMovies(id, mediaType || type || 'movie');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const providers = async (req, res) => {
  try {
    const { mediaType, type } = req.query;
    const data = await getWatchProviders(mediaType || type || 'movie');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const byProvider = async (req, res) => {
  try {
    const { providerId, mediaType, type } = req.query;
    const data = await discoverByProvider(providerId, mediaType || type || 'movie');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
