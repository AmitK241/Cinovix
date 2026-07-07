import User from '../models/User.js';
import { createNotification } from '../services/notificationService.js';

// @desc  Get user's My List
// @route GET /api/mylist
export const getMyList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user.myList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add item to My List
// @route POST /api/mylist
export const addToMyList = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, poster_path } = req.body;

    const user = await User.findById(req.user._id);

    const alreadyExists = user.myList.some((item) => item.tmdbId === tmdbId);
    if (alreadyExists) {
      return res.status(400).json({ message: 'Already in My List' });
    }

    user.myList.push({ tmdbId, mediaType, title, poster_path });
    await user.save();
    await createNotification(req.user._id, {
      icon: '✅',
      title: 'Added to Watchlist',
      message: `'${title}' was successfully saved to your My List.`,
    });

    res.status(201).json(user.myList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Remove item from My List
// @route DELETE /api/mylist/:tmdbId
export const removeFromMyList = async (req, res) => {
  try {
    const { tmdbId } = req.params;

    const user = await User.findById(req.user._id);
    user.myList = user.myList.filter((item) => item.tmdbId !== Number(tmdbId));
    await user.save();

    res.status(200).json(user.myList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};