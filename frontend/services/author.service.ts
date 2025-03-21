// services/author.service.ts
import apiClient from './api.service';

const AuthorService = {
    // Obtener todos los autores
    getAllAuthors: async () => {
        try {
            const response = await apiClient.get('/authors');
            return response.data;
        } catch (error) {
            console.error('Error al obtener autores:', error);
            throw error;
        }
    },

    // Obtener autor por cédula
    getAuthorByCedula: async (cedula: string) => {
        try {
            const response = await apiClient.get(`/authors/${cedula}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener autor con cédula ${cedula}:`, error);
            throw error;
        }
    },

    // Crear autor (solo admin)
    createAuthor: async (authorData: Partial<Autor>) => {
        try {
            const response = await apiClient.post('/authors', authorData);
            return response.data;
        } catch (error) {
            console.error('Error al crear autor:', error);
            throw error;
        }
    },

    // Actualizar autor (solo admin)
    updateAuthor: async (cedula: string, authorData: Partial<Autor>) => {
        try {
            const response = await apiClient.put(`/authors/${cedula}`, authorData);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar autor con cédula ${cedula}:`, error);
            throw error;
        }
    },

    // Eliminar autor (solo admin)
    deleteAuthor: async (cedula: string) => {
        try {
            const response = await apiClient.delete(`/authors/${cedula}`);
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar autor con cédula ${cedula}:`, error);
            throw error;
        }
    },

    // Obtener reporte de autor con sus libros (solo empleado)
    getAuthorReport: async (cedula: string) => {
        try {
            const response = await apiClient.get(`/reports/authors/${cedula}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener reporte del autor con cédula ${cedula}:`, error);
            throw error;
        }
    }
};

export default AuthorService;