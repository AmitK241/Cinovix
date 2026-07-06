import api from './api';

export const getReviews = async (tmdbId) => {
  const response = await api.get(`/reviews/${tmdbId}`);
  return response.data;
};

export const getMyReview = async (tmdbId) => {
  const response = await api.get(`/reviews/${tmdbId}/mine`);
  return response.data;
};

export const submitReview = async (data) => {
  const response = await api.post('/reviews', data);
  return response.data;
};

export const deleteReview = async (tmdbId) => {
  const response = await api.delete(`/reviews/${tmdbId}`);
  return response.data;
};