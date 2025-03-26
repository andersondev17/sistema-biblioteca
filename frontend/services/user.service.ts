// services/user.service.ts
import { storage, TOKEN_KEY } from '@/services/auth.service';
import apiClient from './api.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UserService = {
    // Obtener todos los usuarios
    getAllUsers: async () => {
        try {
            const token = storage.get<string>(TOKEN_KEY);

            const response = await fetch(`${API_URL}/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            throw error;
        }
    },

    // Obtener usuario por ID
    getUserById: async (id: number) => {
        try {
            const response = await apiClient.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener usuario con ID ${id}:`, error);
            throw error;
        }
    },

    // Crear usuario (solo admin)
    // Crear usuario (solo admin)
    createUser: async (userData: any) => {
        try {
            const token = storage.get<string>(TOKEN_KEY);
            console.log('Creando usuario con token:', token);
            console.log('Datos del usuario:', userData);

            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error en la respuesta:', response.status, errorData);
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Usuario creado:', data);
            return data;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    },


    // Actualizar usuario (solo admin)
    updateUser: async (id: number, userData: any) => {
        try {
            const response = await apiClient.put(`/users/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar usuario con ID ${id}:`, error);
            throw error;
        }
    },

    // Eliminar usuario (solo admin)
    deleteUser: async (id: number) => {
        try {
            const token = storage.get<string>(TOKEN_KEY);
            
            // Usar fetch directamente para mayor control
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(`Error al eliminar usuario con ID ${id}:`, error);
            throw error;
        }
    }
};

export default UserService;