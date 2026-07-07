import WatchHistory from '../models/WatchHistory.js';

export const getWatchHistory = async (req, res) => {
  try {
    const history = await WatchHistory.find({ userId: req.user._id })
      .sort({ watchedAt: -1 })
      .limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const {
      tmdbId, mediaType, title,
      poster_path, posterPath,          // accept either casing
      progressSeconds, durationSeconds, // Watch.jsx sends these
      progress,                         // legacy field
    } = req.body;

    const entry = await WatchHistory.findOneAndUpdate(
      { userId: req.user._id, tmdbId },
      {
        userId: req.user._id,
        tmdbId,
        mediaType: mediaType || 'movie',
        title,
        posterPath: posterPath || poster_path || null,
        progress: typeof progress === 'number' ? progress : 0,
        progressSeconds: progressSeconds || 0,
        durationSeconds: durationSeconds || 0,
        watchedAt: new Date(),
      },
      { upsert: true, new: true }
    );
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProgressById = async (req, res) => {
  try {
    const entry = await WatchHistory.findOne({
      userId: req.user._id,
      tmdbId: Number(req.params.tmdbId),
    });
    res.json(entry || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
