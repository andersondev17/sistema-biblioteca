// services/api.service.ts
import { storage, TOKEN_KEY } from '@/services/auth.service';
import axios from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

console.log("API URL:", API_URL); // Para depuración

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000
});

// Interceptor de solicitudes
apiClient.interceptors.request.use(
    (config) => {
      const token = storage.get<string>(TOKEN_KEY);
      if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de respuestas simplificado
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default apiClient;