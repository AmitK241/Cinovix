import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Automatically attach token to every request if it exists & log requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cinovix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      params: config.params,
    });
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(
      `[API Error] ${error.response?.status || 'Network Error'} ${error.config?.url}:`,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default api;