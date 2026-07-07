import api from './api';

export const getTrending = async (mediaType = 'movie') => {
  const response = await api.get('/content/trending', { params: { mediaType } });
  return response.data;
};

export const getByLanguage = async (language, mediaType = 'movie') => {
  const response = await api.get('/content/language', { params: { language, mediaType } });
  return response.data;
};

export const searchContent = async (query, mediaType = 'movie') => {
  const response = await api.get('/content/search', { params: { query, mediaType } });
  return response.data;
};

export const getDetails = async (id, mediaType = 'movie') => {
  const response = await api.get(`/content/${id}`, { params: { mediaType } });
  return response.data;
};

export const getMyList = async () => {
  const response = await api.get('/mylist');
  return response.data;
};

export const addToMyList = async (item) => {
  const response = await api.post('/mylist', item);
  return response.data;
};

export const removeFromMyList = async (tmdbId) => {
  const response = await api.delete(`/mylist/${tmdbId}`);
  return response.data;
};

export const updateProgress = async (data) => {
  const response = await api.post('/history', data);
  return response.data;
};

export const getProgressById = async (tmdbId) => {
  const response = await api.get(`/history/${tmdbId}`);
  return response.data;
};

export const getContinueWatching = async () => {
  const response = await api.get('/history');
  return response.data;
};

export const getSimilarMovies = async (id, mediaType = 'movie') => {
  const response = await api.get(`/content/${id}/similar`, { params: { mediaType } });
  return response.data;
};

export const getProviders = async (mediaType = 'movie') => {
  const response = await api.get('/content/providers', { params: { mediaType } });
  return response.data;
};

export const getByProvider = async (providerId, mediaType = 'movie') => {
  const response = await api.get('/content/by-provider', { params: { providerId, mediaType } });
  return response.data;
};