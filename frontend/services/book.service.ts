// services/book.service.ts
import apiClient from './api.service';

const BookService = {
    // Obtener todos los libros
    getAllBooks: async () => {
        try {
            const response = await apiClient.get('/books');
            return response.data;
        } catch (error) {
            console.error('Error al obtener libros:', error);
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