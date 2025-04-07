// hooks/useAuthorReport.ts
import { GET_FULL_AUTHORS_REPORT } from "@/graphql/queries/author.query";
import AuthService from "@/services/auth.service";
import graphqlClient from "@/services/graphql.service";
import { useCallback, useEffect, useState } from "react";

export const useAuthorReport = (initialCedula?: string) => {
    const [author, setAuthor] = useState<Autor | null>(null);
    const [loading, setLoading] = useState(initialCedula ? true : false);
    const [error, setError] = useState<Error | null>(null);
    const [searchCedula, setSearchCedula] = useState(initialCedula || "");

    // Función optimizada para buscar autor
    const fetchAuthor = useCallback(async (cedula: string) => {
        if (!cedula) return;

        setLoading(true);
        setError(null);

        try {
            // Verificar token antes de realizar la consulta
            const token = AuthService.getToken();
            if (!token) {
                throw new Error("No has iniciado sesión o tu sesión ha expirado");
            }

            const { data } = await graphqlClient.query({
                query: GET_FULL_AUTHORS_REPORT,
                variables: { cedula },
                fetchPolicy: 'network-only',
                context: {
                    // Asegurar que el token se esté enviando correctamente
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                }
            });

            // Añadir URLs de portada a los libros
            if (data.autor) {
                setAuthor({
                    ...data.autor,
                    libros: (data.autor.libros || []).map((libro:LibroView) => ({
                        ...libro,
                        cover: `https://picsum.photos/seed/${libro.isbn}/300/450`
                    }))
                });
            } else {
                setAuthor(null);
                setError(new Error("Autor no encontrado"));
            }
        } catch (err) {
            console.error("Error al obtener autor:", err);
            setError(err instanceof Error ? err : new Error("Error al buscar el autor"));
        } finally {
            setLoading(false);
        }
    }, []);

    // Efecto para cargar el autor inicial
    useEffect(() => {
        if (initialCedula) {
            fetchAuthor(initialCedula);
        }
    }, [initialCedula, fetchAuthor]);

    // Manejadores para la búsqueda
    const handleSearch = useCallback(() => {
        if (searchCedula.trim()) {
            fetchAuthor(searchCedula.trim());
        }
    }, [searchCedula, fetchAuthor]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);

    return {
        author,
        loading,
        error,
        searchCedula,
        setSearchCedula,
        handleSearch,
        handleKeyDown,
        isAuthenticated: !!AuthService.getCurrentUser()
    };
};