// hooks/useAuthors.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export function useAuthors(initialCedula?: string) {
    const [authors, setAuthors] = useState<Autor[]>([]);
    const [currentAuthor, setCurrentAuthor] = useState<Autor | null>(null);
    const [loading, setLoading] = useState(true);

    const cache = useRef({
        timestamp: 0,
        authors: [] as Autor[],
        details: {} as Record<string, Autor>
    });

    const loadAuthors = useCallback(async (force = false) => {
        // Usar caché si es válida (menos de 1 minuto)
        if (!force && cache.current.authors.length && Date.now() - cache.current.timestamp < 60000) {
            setAuthors(cache.current.authors);
            setLoading(false);
            return cache.current.authors;
        }

        setLoading(true);

        try {
            const service = await import("@/services/author.service").then(m => m.default);
            const data = await service.getAllAuthors();

            // Actualizar caché y estado
            cache.current = { timestamp: Date.now(), authors: data, details: cache.current.details };
            setAuthors(data);
            return data;
        } catch (error) {
            console.error("Error cargando autores:", error);
            toast.error("Error al cargar autores");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const getAuthor = useCallback(async (cedula: string) => {
        // Buscar en caché primero
        if (cache.current.details[cedula]) {
            setCurrentAuthor(cache.current.details[cedula]);
            return cache.current.details[cedula];
        }

        // Buscar en lista cargada
        const foundAuthor = authors.find(a => a.cedula === cedula);
        if (foundAuthor) {
            cache.current.details[cedula] = foundAuthor;
            setCurrentAuthor(foundAuthor);
            return foundAuthor;
        }

        try {
            const service = await import("@/services/author.service").then(m => m.default);
            const data = await service.getAuthorByCedula(cedula);

            // Actualizar caché y estado
            cache.current.details[cedula] = data;
            setCurrentAuthor(data);
            return data;
        } catch (error) {
            console.error(`Error al cargar autor (${cedula}):`, error);
            return null;
        }
    }, [authors]);

    // Eliminar autor 
    const deleteAuthor = useCallback(async (cedula: string) => {
        try {
            // Actualizar UI inmediatamente
            setAuthors(authors => authors.filter(a => a.cedula !== cedula));

            const service = await import("@/services/author.service").then(m => m.default);
            await service.deleteAuthor(cedula);

            // Actualizar caché
            cache.current.authors = cache.current.authors.filter(a => a.cedula !== cedula);
            delete cache.current.details[cedula];

            return true;
        } catch (error) {
            console.error("Error:", error);
            loadAuthors(true); // Recargar en caso de error
            return false;
        }
    }, [loadAuthors]);

    // Inicialización
    useEffect(() => {
        loadAuthors();
        if (initialCedula) getAuthor(initialCedula);
    }, [loadAuthors, getAuthor, initialCedula]);

    return {
        authors,
        currentAuthor,
        loading,
        refresh: () => loadAuthors(true),
        getAuthor,
        deleteAuthor
    };
}