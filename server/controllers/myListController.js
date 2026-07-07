import MyList from '../models/MyList.js';

export const getMyList = async (req, res) => {
  try {
    const items = await MyList.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addToMyList = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, posterPath, overview } = req.body;
    const item = await MyList.findOneAndUpdate(
      { userId: req.user._id, tmdbId },
      { userId: req.user._id, tmdbId, mediaType, title, posterPath, overview },
      { upsert: true, new: true }
    );
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromMyList = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    await MyList.findOneAndDelete({ userId: req.user._id, tmdbId: Number(tmdbId) });
    res.json({ message: 'Removed from list' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
