import Review from '../models/Review.js';

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tmdbId: Number(req.params.tmdbId) })
      .populate('userId', 'email')
      .sort({ updatedAt: -1 });

    const enriched = reviews.map((r) => ({
      _id: r._id,
      rating: r.rating,
      comment: r.text || '',
      userEmail: r.userId?.email || 'Anonymous',
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    const avgRating =
      enriched.length > 0
        ? +(enriched.reduce((sum, r) => sum + r.rating, 0) / enriched.length).toFixed(1)
        : 0;

    res.json({ reviews: enriched, avgRating, totalReviews: enriched.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      userId: req.user._id,
      tmdbId: Number(req.params.tmdbId),
    });
    if (!review) return res.json(null);
    res.json({
      _id: review._id,
      rating: review.rating,
      comment: review.text || '',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const upsertReview = async (req, res) => {
  try {
    const { tmdbId, mediaType, rating, comment } = req.body;
    const review = await Review.findOneAndUpdate(
      { userId: req.user._id, tmdbId },
      { userId: req.user._id, tmdbId, mediaType, rating, text: comment },
      { upsert: true, new: true }
    );
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await Review.findOneAndDelete({
      userId: req.user._id,
      tmdbId: Number(req.params.tmdbId),
    });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
