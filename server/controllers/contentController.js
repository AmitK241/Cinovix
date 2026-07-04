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
    const { mediaType } = req.query;
    const data = await getTrending(mediaType);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const byLanguage = async (req, res) => {
  try {
    const { language, mediaType } = req.query;
    const data = await getPopularByLanguage(language, mediaType);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const byGenre = async (req, res) => {
  try {
    const { genreId, mediaType } = req.query;
    const data = await getByGenre(genreId, mediaType);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const search = async (req, res) => {
  try {
    const { query, mediaType } = req.query;
    const data = await searchContent(query, mediaType);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const details = async (req, res) => {
  try {
    const { id } = req.params;
    const { mediaType } = req.query;
    const data = await getDetailsById(id, mediaType);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const similar = async (req, res) => {
  try {
    const { id } = req.params;
    const { mediaType } = req.query;
    const data = await getSimilarMovies(id, mediaType);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const providers = async (req, res) => {
  try {
    const { mediaType } = req.query;
    const data = await getWatchProviders(mediaType);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const byProvider = async (req, res) => {
  try {
    const { providerId, mediaType } = req.query;
    const data = await discoverByProvider(providerId, mediaType);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};