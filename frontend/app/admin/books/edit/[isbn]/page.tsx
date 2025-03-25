'use client';

import BookForm from "@/components/admin/forms/BookForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import BookService from "@/services/book.service";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EditBookPage = () => {
    const params = useParams();
    const router = useRouter();
    const isbn = params.isbn as string;

    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBook = async () => {
            if (!isbn) return;

            try {
                setLoading(true);
                const bookData = await BookService.getBookByISBN(isbn);
                setBook(bookData);
            } catch (error: any) {
                console.error("Error al cargar libro:", error);
                setError(error.message || "No se pudo cargar la información del libro");
                toast.error("Error al cargar libro");
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [isbn]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-light-300">Cargando libro...</span>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-red-500">Error</h2>
                <p className="text-slate-700">{error || "No se encontró el libro"}</p>
                <Button
                    onClick={() => router.push('/admin/books')}
                    className="mt-4"
                >
                    Volver a libros
                </Button>
            </div>
        );
    }

    return (
        <ProtectedRoute adminOnly>
            <Button
                asChild
                className="mb-6 w-fit border border-light-300 bg-white text-xs font-medium text-dark-200 hover:bg-light-300 transition-colors rounded-md px-4 py-2 shadow-sm"
            >
            </Button>

            <section className="w-full max-w-2xl bg-white rounded-2xl p-7 shadow-sm">
                <BookForm initialData={book} />
            </section>
        </ProtectedRoute>
    );
};

export default EditBookPage;