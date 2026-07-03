import api from './api';

export const getProfiles = async () => {
  const response = await api.get('/profiles');
  return response.data;
};

export const createProfile = async (profileData) => {
  const response = await api.post('/profiles', profileData);
  return response.data;
};

export const deleteProfile = async (profileId) => {
  const response = await api.delete(`/profiles/${profileId}`);
  return response.data;
};