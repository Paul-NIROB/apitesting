import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (name, email, password, role = 'USER') => {
    const response = await api.post('/auth/register', { name, email, password, role });
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export const taskService = {
  getAll: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  create: async (task) => {
    const response = await api.post('/tasks', task);
    return response.data;
  },
  update: async (id, task) => {
    const response = await api.put(`/tasks/${id}`, task);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

export default api;
