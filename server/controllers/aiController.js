import { analyzeUserTaste, parseSearchQuery } from '../services/aiService.js';
import { discoverByMood } from '../services/tmdbService.js';
import User from '../models/User.js';

export const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const titles = [
      ...user.myList.map((item) => item.title),
      ...user.watchHistory.map((item) => item.title),
    ].filter(Boolean);

    if (titles.length === 0) {
      return res.status(200).json({
        message: 'Add some movies to My List to get personalized recommendations',
        results: [],
      });
    }

    const tasteProfile = await analyzeUserTaste(titles);
    const results = await discoverByMood(tasteProfile.genres, null, 'movie');

    res.status(200).json({
      tasteProfile,
      results: results.slice(0, 12),
    });
  } catch (error) {
    console.error('AI Recommendation error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const semanticSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    const parsed = await parseSearchQuery(query);
    const results = await discoverByMood(parsed.genres, parsed.language, 'movie');

    res.status(200).json({
      parsed,
      results,
    });
  } catch (error) {
    console.error('Semantic search error:', error.message);
    res.status(500).json({ message: error.message });
  }
};