import mongoose from 'mongoose';

const watchHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tmdbId: { type: Number, required: true },
    mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' },
    title: String,
    posterPath: String,
    progress: { type: Number, default: 0 },         // 0-100 percent (legacy)
    progressSeconds: { type: Number, default: 0 },  // exact seconds elapsed
    durationSeconds: { type: Number, default: 0 },  // total content duration
    watchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

watchHistorySchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);
export default WatchHistory;
