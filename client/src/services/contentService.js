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