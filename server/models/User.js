import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, default: '🎬' },
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    profiles: { type: [profileSchema], default: [] },
    subscription: {
      plan: { type: String, enum: ['free', 'basic', 'standard', 'premium'], default: 'free' },
      status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
      expiresAt: { type: Date, default: null },
      orderId: { type: String, default: null },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
