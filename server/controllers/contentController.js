import {
  getTrending,
  getPopularByLanguage,
  getByGenre,
  searchContent,
  getDetailsById,
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