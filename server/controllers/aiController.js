import { analyzeUserTaste, parseSearchQuery } from '../services/aiService.js';
import { discoverByMood, searchContent } from '../services/tmdbService.js';
import MyList from '../models/MyList.js';
import WatchHistory from '../models/WatchHistory.js';

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Gather titles from watch history + my list
    const [history, myList] = await Promise.all([
      WatchHistory.find({ userId }).sort({ watchedAt: -1 }).limit(20),
      MyList.find({ userId }).limit(20),
    ]);

    const titles = [
      ...history.map((h) => h.title).filter(Boolean),
      ...myList.map((m) => m.title).filter(Boolean),
    ];

    if (titles.length === 0) {
      // Cold start: return popular action movies
      const data = await discoverByMood(['Action']);
      return res.json({ taste: null, results: data });
    }

    const taste = await analyzeUserTaste(titles);
    const results = await discoverByMood(taste.genres || ['Drama']);
    res.json({ taste, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const semanticSearch = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: 'Query is required' });

    const parsed = await parseSearchQuery(query);

    let results = [];
    if (parsed.keywords) {
      results = await searchContent(parsed.keywords, 'movie');
    }
    if (results.length === 0 && parsed.genres?.length) {
      results = await discoverByMood(parsed.genres, parsed.language);
    }

    res.json({ parsed, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
