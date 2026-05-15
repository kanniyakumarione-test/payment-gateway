import axios from 'axios';
import { auth } from './firebase';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to attach the Firebase token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchTransactions = async (merchantId) => {
  const response = await api.get(`/payments/list/${merchantId}`);
  return response.data.transactions;
};

export const createTransaction = async (transactionData) => {
  const response = await api.post('/payments/create', transactionData);
  return response.data.transaction;
};

export default api;
