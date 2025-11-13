import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('creditCardToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'Something went wrong';
    console.error('API Error:', message);

    // If 401 Unauthorized, clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('creditCardToken');
      localStorage.removeItem('creditCardUser');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// User API calls
export const userAPI = {
  getUser: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
};

// Card API calls
export const cardAPI = {
  getCards: async () => {
    const response = await api.get('/cards');
    return response.data;
  },
  
  getUserCards: async (userId: string) => {
    const response = await api.get(`/users/${userId}/cards`);
    return response.data;
  },
  
  getCard: async (cardId: string) => {
    const response = await api.get(`/cards/${cardId}`);
    return response.data;
  },
  
  createCard: async (cardData: {
    name: string;
    balance: number;
    interestRate: number;
    dueDate: string;
    minimumPayment: number;
  }) => {
    const response = await api.post('/cards', cardData);
    return response.data;
  },
  
  updateCard: async (cardId: string, cardData: {
    name?: string;
    balance?: number;
    interestRate?: number;
    dueDate?: string;
    minimumPayment?: number;
  }) => {
    const response = await api.put(`/cards/${cardId}`, cardData);
    return response.data;
  },
  
  deleteCard: async (cardId: string) => {
    const response = await api.delete(`/cards/${cardId}`);
    return response.data;
  },
};

// Transaction API calls
export const transactionAPI = {
  getCardTransactions: async (cardId: string) => {
    const response = await api.get(`/transactions/card/${cardId}`);
    return response.data;
  },
  
  createTransaction: async (transactionData: {
    amount: number;
    type: 'payment' | 'purchase';
    date: string;
    description?: string;
    cardId: string;
  }) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },
  
  deleteTransaction: async (transactionId: string) => {
    const response = await api.delete(`/transactions/${transactionId}`);
    return response.data;
  },
};

export default api; 