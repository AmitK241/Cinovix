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
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;