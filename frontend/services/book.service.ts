// services/book.service.ts
import { storage, TOKEN_KEY } from '@/services/auth.service';
import apiClient from './api.service';
const API_URL = process.env.NEXT_PUBLIC_API_URL;


const BookService = {
    // Obtener todos los libros
    getAllBooks: async () => {
        try {
            const token = storage.get<string>(TOKEN_KEY);
            console.log('Obteniendo libros con token:', token);

            const response = await fetch(`${API_URL}/books`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error('Error en la respuesta:', response.status, response.statusText);
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Libros obtenidos:', data);
            return data;
        } catch (error) {
            console.error('Error al cargar libros:', error);
            throw error;
        }
    },
    // Obtener libro por ISBN
    getBookByISBN: async (isbn: string) => {
        try {
            const response = await apiClient.get(`/books/${isbn}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener libro con ISBN ${isbn}:`, error);
            throw error;
        }
    },

    // Crear libro (solo admin)
    createBook: async (bookData: Partial<Libro>) => {
        try {
            const response = await apiClient.post('/books', bookData);
            return response.data;
        } catch (error) {
            console.error('Error al crear libro:', error);
            throw error;
        }
    },

    // Actualizar libro (solo admin)
    updateBook: async (isbn: string, bookData: Partial<Libro>) => {
        try {
            const response = await apiClient.put(`/books/${isbn}`, bookData);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar libro con ISBN ${isbn}:`, error);
            throw error;
        }
    },

    // Eliminar libro (solo admin)
    deleteBook: async (isbn: string) => {
        try {
            const response = await apiClient.delete(`/books/${isbn}`);
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar libro con ISBN ${isbn}:`, error);
            throw error;
        }
    }
};

export default BookService;