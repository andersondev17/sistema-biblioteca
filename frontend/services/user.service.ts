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
    createUser: async (userData: any) => {
        try {
            const response = await apiClient.post('/users', userData);
            return response.data;
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
            const response = await apiClient.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar usuario con ID ${id}:`, error);
            throw error;
        }
    }
};

export default UserService;