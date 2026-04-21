import axios from 'axios';
import { getAuthSession } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

api.interceptors.request.use((config) => {
  const session = getAuthSession();

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

export default api;
