import mongoose from 'mongoose';

const myListSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tmdbId: { type: Number, required: true },
    mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' },
    title: String,
    posterPath: String,
    overview: String,
  },
  { timestamps: true }
);

myListSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

const MyList = mongoose.model('MyList', myListSchema);
export default MyList;
