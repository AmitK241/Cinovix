import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'basic', 'standard', 'premium'],
      default: 'free',
    },
    myList: [
      {
        tmdbId: { type: Number, required: true },
        mediaType: { type: String, default: 'movie' },
        title: { type: String },
        poster_path: { type: String },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    watchHistory: [
      {
        tmdbId: { type: Number, required: true },
        mediaType: { type: String, default: 'movie' },
        title: { type: String },
        poster_path: { type: String },
        progressSeconds: { type: Number, default: 0 },
        durationSeconds: { type: Number, default: 0 },
        lastWatched: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;