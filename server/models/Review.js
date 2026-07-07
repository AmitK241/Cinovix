import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tmdbId: { type: Number, required: true },
    mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' },
    rating: { type: Number, min: 1, max: 10 },
    text: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

reviewSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
