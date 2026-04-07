import axios from 'axios';

// Create a globally configured Axios instance
export const api = axios.create({
  baseURL: 'https://school-management-app-6pkq.onrender.com', // Force production backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to automatically inject the Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Intercept responses to handle global errors (e.g. 401 Unauthorized redirect)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic to clear token and redirect to login if session expires
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if they are not already on one of the login pages
      if (!window.location.hash.includes('/login')) {
          window.location.hash = '#/login';
      }
    } else if (error.response?.status === 403) {
      const message = error.response.data?.message || '';
      if (message.includes('expiré') || message.includes('inactif') || message.includes('licence')) {
         // DO NOT remove token! Allow the user to visit the subscription page to enter a new key.
         if (window.location.hash !== '#/subscription') {
             window.location.hash = '#/subscription';
         }
      }
    }
    return Promise.reject(error);
  }
);
