import Notification from '../models/Notification.js';

// @desc  Get all notifications for logged-in user
// @route GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Mark all as read
// @route PATCH /api/notifications/read-all
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, unread: true }, { unread: false });
    res.status(200).json({ message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Dismiss (delete) one notification
// @route DELETE /api/notifications/:id
export const dismissNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.status(200).json({ message: 'Dismissed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Clear all notifications
// @route DELETE /api/notifications
export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user._id });
    res.status(200).json({ message: 'All cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};