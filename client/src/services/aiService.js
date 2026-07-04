import api from './api';

export const getRecommendations = async () => {
  const response = await api.get('/ai/recommendations');
  return response.data;
};

export const semanticSearch = async (query) => {
  const response = await api.post('/ai/search', { query });
  return response.data;
};