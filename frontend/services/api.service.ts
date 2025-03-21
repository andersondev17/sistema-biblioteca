// services/api.service.ts
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Configuración base de Axios
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Reducir el timeout para evitar bloqueos largos
    timeout: 8000
});

// Añadir token de autenticación a todas las solicitudes
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            // Usar 'token' como clave según la documentación
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Gestionar respuestas y errores
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Manejar error de rate limit (429)
        if (error.response && error.response.status === 429) {
            // Extraer el tiempo de espera recomendado si está disponible
            const retryAfter = error.response.headers['retry-after'] ||
                error.response.data?.retryAfter ||
                '30 segundos';

            toast.error(`Demasiadas solicitudes. Por favor espere ${retryAfter}.`);
            return Promise.reject(error);
        }

        // Manejar error de autenticación (401)
        if (error.response && error.response.status === 401) {
            toast.error('Sesión expirada o no válida. Por favor inicie sesión nuevamente.');

            // Limpiar datos de autenticación
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redireccionar a login si no estamos ya allí
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                window.location.href = '/login';
            }

            return Promise.reject(error);
        }

        // Manejar error de acceso restringido (403)
        if (error.response && error.response.status === 403) {
            const message = error.response.data?.message || 'No tiene permisos para realizar esta acción';
            toast.error(message);
            return Promise.reject(error);
        }

        // Manejar otros errores del servidor
        if (error.response) {
            const message = error.response.data?.message || 'Error en el servidor';
            console.error('Error de API:', message);
            toast.error(message);
        } else if (error.request) {
            // Error de red
            console.error('Error de red:', error.message);
            toast.error('No se pudo conectar con el servidor. Verifique su conexión.');
        } else {
            // Otros errores
            console.error('Error:', error.message);
            toast.error('Ocurrió un error inesperado.');
        }

        return Promise.reject(error);
    }
);

export default apiClient;