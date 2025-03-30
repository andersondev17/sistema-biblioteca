// hooks/useLibraryData.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Duración de caché en milisegundos (1 minuto)
const CACHE_DURATION = 60000;

export function useLibraryData() {
    const [books, setBooks] = useState<LibroView[]>([]);
    const [authors, setAuthors] = useState<Autor[]>([]);
    const [loading, setLoading] = useState(true);

    // Caché para reducir peticiones
    const cache = useRef<{
        timestamp: number;
        books: LibroView[];
        authors: Autor[];
    }>({
        timestamp: 0,
        books: [],
        authors: []
    });

    // Cargar datos con manejo optimizado
    const loadData = useCallback(async (forceRefresh = false) => {
        // Usar datos en caché si están disponibles y son recientes
        if (!forceRefresh &&
            cache.current.timestamp > 0 &&
            Date.now() - cache.current.timestamp < CACHE_DURATION &&
            cache.current.books.length > 0) {

            setBooks(cache.current.books);
            setAuthors(cache.current.authors);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            // Importar servicios dinámicamente para reducir bundle inicial
            const [BookService, AuthorService] = await Promise.all([
                import("@/services/book.service").then(m => m.default),
                import("@/services/author.service").then(m => m.default)
            ]);

            // Ejecutar peticiones en paralelo
            const [booksData, authorsData] = await Promise.all([
                BookService.getAllBooks(),
                AuthorService.getAllAuthors()
            ]);

            // Actualizar caché
            cache.current = {
                timestamp: Date.now(),
                books: booksData,
                authors: authorsData
            };

            setBooks(booksData);
            setAuthors(authorsData);
        } catch (error) {
            console.error("Error cargando datos:", error);
            toast.error("Error cargando datos");
        } finally {
            setLoading(false);
        }
    }, []);

    // Eliminar libro con actualización inmediata
    const deleteBook = useCallback(async (isbn: string) => {
        try {
            const BookService = await import("@/services/book.service").then(m => m.default);
            await BookService.deleteBook(isbn);

            // Actualizar estado local sin esperar recarga
            setBooks(prevBooks => prevBooks.filter(book => book.isbn !== isbn));

            // Actualizar caché
            cache.current.books = cache.current.books.filter(book => book.isbn !== isbn);

            return true;
        } catch (error) {
            console.error("Error eliminando libro:", error);
            return false;
        }
    }, []);

    // Cargar datos al montar el componente
    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        books,
        authors,
        loading,
        refresh: () => loadData(true),
        deleteBook
    };
}