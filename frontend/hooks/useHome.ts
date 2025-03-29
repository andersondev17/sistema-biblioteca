// hooks/useHome.ts
import { authorsInfo, sampleBooks } from "@/constants";
import { useLibraryData } from "@/hooks/useLibraryData";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useHome() {
    const router = useRouter();
    const { books: apiBooks, authors: apiAuthors, loading } = useLibraryData();
    const [selectedISBN, setSelectedISBN] = useState("");
    const [books, setBooks] = useState<LibroView[]>([]);
    const [authors, setAuthors] = useState<Autor[]>([]);
    const [error, setError] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Comprobar autenticación
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const AuthService = await import("@/services/auth.service").then(m => m.default);
                setIsAuthenticated(AuthService.isAuthenticated());
            } catch (error) {
                console.error("Error checking auth:", error);
            }
        };

        checkAuth();
    }, []);

    // Procesar libros cuando estén disponibles
    useEffect(() => {
        if (loading) return;

        try {
            if (apiBooks.length > 0) {
                // Asegurarse de que todos los libros tengan portada
                const processedBooks = apiBooks.map(book => ({
                    ...book,
                    cover: book.cover || `https://picsum.photos/seed/${book.isbn}/400/600`
                }));

                setBooks(processedBooks);

                // Seleccionar el primer libro si no hay ninguno seleccionado
                if (!selectedISBN && processedBooks.length > 0) {
                    setSelectedISBN(processedBooks[0].isbn);
                }
            } else if (process.env.NODE_ENV === 'development') {
                // Usar datos de muestra en desarrollo
                setBooks(sampleBooks);
                if (!selectedISBN) setSelectedISBN(sampleBooks[0].isbn);
                toast.error("Usando datos de muestra para libros");
            } else {
                setError(true);
            }

            // Procesar autores
            if (apiAuthors.length > 0) {
                setAuthors(apiAuthors);
            } else if (process.env.NODE_ENV === 'development') {
                setAuthors(authorsInfo);
                toast.error("Usando datos de muestra para autores");
            } else {
                setError(true);
            }
        } catch (error) {
            console.error("Error processing data:", error);
            setError(true);
        }
    }, [apiBooks, apiAuthors, loading, selectedISBN]);

    // Seleccionar un libro
    const selectBook = useCallback((isbn: string) => {
        setSelectedISBN(isbn);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Manejar acciones que requieren autenticación
    const handleAuthRequiredAction = useCallback((action: () => void) => {
        if (isAuthenticated) {
            action();
        } else {
            toast.error("Necesitas iniciar sesión para realizar esta acción");
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    // Calcular libro y autor seleccionados
    const selectedBook = books.find(b => b.isbn === selectedISBN);
    const selectedAuthor = selectedBook
        ? authors.find(a => a.cedula === selectedBook.autorCedula)
        : null;

    // Obtener libros relacionados (mismo autor)
    const relatedBooks = selectedBook
        ? books.filter(b => b.autorCedula === selectedBook.autorCedula && b.isbn !== selectedBook.isbn)
        : [];

    return {
        books,
        authors,
        selectedBook,
        selectedAuthor,
        selectedISBN,
        relatedBooks,
        loading,
        error,
        isAuthenticated,
        selectBook,
        handleAuthRequiredAction
    };
}