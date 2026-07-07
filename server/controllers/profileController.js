import User from '../models/User.js';

export const getProfiles = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('profiles');
    res.json(user.profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (user.profiles.length >= 5)
      return res.status(400).json({ message: 'Maximum 5 profiles allowed' });

    user.profiles.push({ name, avatar: avatar || '🎬' });
    await user.save();
    res.status(201).json(user.profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.profiles = user.profiles.filter(
      (p) => p._id.toString() !== req.params.id
    );
    await user.save();
    res.json(user.profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
