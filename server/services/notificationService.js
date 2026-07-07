import Notification from '../models/Notification.js';

export const createNotification = async (userId, { icon, title, message }) => {
  try {
    await Notification.create({ userId, icon, title, message });
  } catch (error) {
    console.error('Error creating notification:', error.message);
  }
};