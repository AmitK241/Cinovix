import Review from '../models/Review.js';

// @desc  Get all reviews for a title + average rating
// @route GET /api/reviews/:tmdbId
export const getReviews = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const reviews = await Review.find({ tmdbId: Number(tmdbId) }).sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.status(200).json({
      reviews,
      avgRating: Number(avgRating.toFixed(1)),
      totalReviews: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add or update a review (one per user per movie)
// @route POST /api/reviews
export const upsertReview = async (req, res) => {
  try {
    const { tmdbId, mediaType, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = await Review.findOneAndUpdate(
      { userId: req.user._id, tmdbId: Number(tmdbId) },
      {
        userId: req.user._id,
        userEmail: req.user.email,
        tmdbId: Number(tmdbId),
        mediaType,
        rating,
        comment,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete own review
// @route DELETE /api/reviews/:tmdbId
export const deleteReview = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    await Review.findOneAndDelete({ userId: req.user._id, tmdbId: Number(tmdbId) });
    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get current user's review for a title (to prefill edit form)
// @route GET /api/reviews/:tmdbId/mine
export const getMyReview = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const review = await Review.findOne({ userId: req.user._id, tmdbId: Number(tmdbId) });
    res.status(200).json(review || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};