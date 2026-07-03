import User from '../models/User.js';

// @desc  Get watch history (continue watching list)
// @route GET /api/watch-history
export const getWatchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // Only return items that aren't fully finished (< 95% watched)
    const inProgress = user.watchHistory.filter(
      (item) => item.durationSeconds > 0 && item.progressSeconds / item.durationSeconds < 0.95
    );
    // Most recent first
    inProgress.sort((a, b) => new Date(b.lastWatched) - new Date(a.lastWatched));
    res.status(200).json(inProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update/create progress for a title
// @route POST /api/watch-history
export const updateProgress = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, poster_path, progressSeconds, durationSeconds } = req.body;

    const user = await User.findById(req.user._id);

    const existingIndex = user.watchHistory.findIndex((item) => item.tmdbId === tmdbId);

    if (existingIndex !== -1) {
      user.watchHistory[existingIndex].progressSeconds = progressSeconds;
      user.watchHistory[existingIndex].durationSeconds = durationSeconds;
      user.watchHistory[existingIndex].lastWatched = new Date();
    } else {
      user.watchHistory.push({
        tmdbId,
        mediaType,
        title,
        poster_path,
        progressSeconds,
        durationSeconds,
      });
    }

    await user.save();
    res.status(200).json({ message: 'Progress updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get progress for a specific title (to resume)
// @route GET /api/watch-history/:tmdbId
export const getProgressById = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const user = await User.findById(req.user._id);
    const item = user.watchHistory.find((i) => i.tmdbId === Number(tmdbId));
    res.status(200).json(item || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};