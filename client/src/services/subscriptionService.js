import api from './api';

export const createOrder = async (plan) => {
  const response = await api.post('/subscription/create', { plan });
  return response.data;
};

export const verifyPayment = async (orderId, plan) => {
  const response = await api.post('/subscription/verify', { orderId, plan });
  return response.data;
};

export const cancelSubscription = async () => {
  const response = await api.post('/subscription/cancel');
  return response.data;
};

export const getSubscriptionStatus = async () => {
  const response = await api.get('/subscription/status');
  return response.data;
};