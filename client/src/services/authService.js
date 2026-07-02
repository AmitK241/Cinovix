import api from './api';

export const signupUser = async (email, password) => {
  const response = await api.post('/auth/signup', { email, password });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};