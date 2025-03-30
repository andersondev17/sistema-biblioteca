'use client';

import BookForm from "@/components/admin/forms/BookForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useLoading } from "@/contexts/LoadingContext";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { memo, useEffect, useLayoutEffect, useState } from "react";

const EditBookPage = () => {
    const params = useParams();
    const isbn = params.isbn as string;
    const [book, setBook] = useState<Libro | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { setLoading: setGlobalLoading } = useLoading();

    // Activar carga INMEDIATAMENTE al montar el componente
    useLayoutEffect(() => {
        setGlobalLoading(true);
    }, [setGlobalLoading]);

    useEffect(() => {
        let isMounted = true;
        
        const fetchBook = async () => {
            if (!isbn) return;

            try {
                const BookService = await import("@/services/book.service").then(m => m.default);
                const data = await BookService.getBookByISBN(isbn);
                if (isMounted) setBook(data);
            } catch (error: any) {
                if (isMounted) setError(error.message || "Error cargando libro");
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setGlobalLoading(false); // Siempre desactivar al final
                }
            }
        };

        fetchBook();

        return () => {
            isMounted = false;
            setGlobalLoading(false); // Limpieza si el componente se desmonta
        };
    }, [isbn, setGlobalLoading]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-admin" />
                <span className="ml-2 text-slate-600">Cargando libro...</span>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-red-500">Error</h2>
                <p className="text-slate-700">{error || "No se encontró el libro"}</p>
                <Link
                    href="/admin/books"
                    className="flex items-center text-primary-admin hover:underline gap-2 mt-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a libros
                </Link>
            </div>
        );
    }

    return (
        <ProtectedRoute adminOnly>
            <section className="w-full max-w-3xl bg-white rounded-lg p-6 shadow-sm mx-auto">
                <BookForm initialData={book} />
            </section>
        </ProtectedRoute>
    );
};

export default memo(EditBookPage);