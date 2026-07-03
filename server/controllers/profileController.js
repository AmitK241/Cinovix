import Profile from '../models/Profile.js';

// @desc  Get all profiles for logged-in user
// @route GET /api/profiles
export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ userId: req.user._id });
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create a new profile
// @route POST /api/profiles
export const createProfile = async (req, res) => {
  try {
    const { name, avatar, isKid } = req.body;

    const existingCount = await Profile.countDocuments({ userId: req.user._id });
    if (existingCount >= 5) {
      return res.status(400).json({ message: 'Maximum 5 profiles allowed' });
    }

    const profile = await Profile.create({
      userId: req.user._id,
      name,
      avatar,
      isKid,
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a profile
// @route DELETE /api/profiles/:id
export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, userId: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    await profile.deleteOne();
    res.status(200).json({ message: 'Profile deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};