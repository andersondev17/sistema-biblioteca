// hooks/useAuthorReport.ts
import { useLoading } from "@/contexts/LoadingContext";
import { GET_FULL_AUTHORS_REPORT } from "@/graphql/queries/author.query";
import AuthService from "@/services/auth.service";
import graphqlClient from "@/services/graphql.service";
import { useCallback, useEffect, useRef, useState } from "react";

export const useAuthorReport = (initialCedula?: string) => {
    const [state, setState] = useState({
        author: null as Autor | null,
        loading: true,
        error: null as Error | null
    });
    const [searchCedula, setSearchCedula] = useState(initialCedula || "");
    const [activeCedula, setActiveCedula] = useState(initialCedula || "");

    const { setLoading: setGlobalLoading } = useLoading();
    const isMountedRef = useRef(true);

    // Cache de datos para evitar múltiples peticiones
    const authorsCache = useRef<Autor[]>([]);

    // Función para buscar autor por cédula
    const fetchAuthorReport = useCallback(async (cedula: string) => {
        if (!cedula.trim()) return;

        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            setGlobalLoading(true);

            // Limpiar cache si la cédula buscada no está en la lista
            if (authorsCache.current.length > 0 && !authorsCache.current.some(a => a.cedula === cedula)) {
                authorsCache.current = [];
            }
            // Si tenemos autores en caché, intentamos buscar primero ahí
            if (authorsCache.current.length > 0) {
                const cachedAuthor = authorsCache.current.find(a => a.cedula === cedula);
                if (cachedAuthor) {
                    // Enriquecer libros con imágenes de portada
                    const authorData = {
                        ...cachedAuthor,
                        libros: (cachedAuthor.libros || []).map(libro => ({
                            ...libro,
                            cover: `https://picsum.photos/seed/${libro.isbn}/300/450`
                        }))
                    };

                    setState({
                        author: authorData,
                        loading: false,
                        error: null
                    });

                    setGlobalLoading(false);
                    return; // Evitar petición a la API
                }
            }

            // Si no está en caché, consultamos la API
            const { data } = await graphqlClient.query({
                query: GET_FULL_AUTHORS_REPORT,
                fetchPolicy: 'network-only',
            });

            if (!isMountedRef.current) return;

            // La respuesta viene bajo la clave 'autores'
            const authors = data?.autores || [];

            // Actualizar caché
            authorsCache.current = authors;

            // Buscar el autor por cédula
            const author = authors.find((a: Autor) => a.cedula === cedula);

            if (author) {
                // Enriquecer libros con imágenes de portada
                const authorData = {
                    ...author,
                    libros: (author.libros || []).map((libro: LibroView) => ({
                        ...libro,
                        cover: `https://picsum.photos/seed/${libro.isbn}/300/450`
                    }))
                };

                setState({
                    author: authorData,
                    loading: false,
                    error: null
                });
            } else {
                setState({
                    author: null,
                    loading: false,
                    error: new Error("Autor no encontrado")
                });
            }
        } catch (err) {
            console.error("Error fetching author report:", err);

            if (isMountedRef.current) {
                setState(prev => ({ ...prev, loading: false }));

            }
        } finally {
            if (isMountedRef.current) {
                setGlobalLoading(false);
            }
        }
    }, [setGlobalLoading]);

    // Activar búsqueda cuando cambia initialCedula prop
    useEffect(() => {
        if (initialCedula && initialCedula !== activeCedula) {
            setActiveCedula(initialCedula);
            setSearchCedula(initialCedula);
        }
    }, [initialCedula, activeCedula]);

    // Ejecutar búsqueda cuando cambia la cédula activa
    useEffect(() => {
        if (activeCedula) {
            fetchAuthorReport(activeCedula);
        } else {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, [activeCedula, fetchAuthorReport]);

    // Cleanup al desmontar componente
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Handler para botón de búsqueda
    const handleSearch = useCallback(() => {
        if (searchCedula.trim()) {
            setActiveCedula(searchCedula.trim());
        }
    }, [searchCedula]);

    // Método para búsqueda por Enter
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);

    return {
        ...state,
        searchCedula,
        setSearchCedula,
        handleSearch,
        handleKeyDown,
        isAuthenticated: !!AuthService.getCurrentUser()
    };
};