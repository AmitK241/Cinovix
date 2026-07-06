import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    tmdbId: {
      type: Number,
      required: true,
    },
    mediaType: {
      type: String,
      default: 'movie',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// One review per user per movie
reviewSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;