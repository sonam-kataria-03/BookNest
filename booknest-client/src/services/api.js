import axios from 'axios';


const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fileUrl = (p) =>
  !p ? '' : /^(https?:|blob:|data:)/.test(p) ? p : `${import.meta.env.VITE_FILE_URL || 'http://localhost:5000'}${p}`;

export const errMsg = (e) => e?.response?.data?.message || 'Something went wrong. Please try again.';
export default api;
