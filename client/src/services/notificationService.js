import api from './api';

export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markAllRead = async () => {
  const response = await api.patch('/notifications/read-all');
  return response.data;
};

export const dismissNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

export const clearAllNotifications = async () => {
  const response = await api.delete('/notifications');
  return response.data;
};