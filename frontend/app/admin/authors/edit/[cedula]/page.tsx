'use client';

import AuthorForm from "@/components/admin/forms/AuthorForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import AuthorService from "@/services/author.service";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EditAuthorPage = () => {
    const params = useParams();
    const router = useRouter();
    const cedula = params.cedula as string;

    const [author, setAuthor] = useState<Autor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAuthor = async () => {
            if (!cedula) return;
            
            try {
                setLoading(true);
                const authorData = await AuthorService.getAuthorByCedula(cedula);
                setAuthor(authorData);
            } catch (error: any) {
                console.error(`Error al cargar autor con cédula ${cedula}:`, error);
                setError(error.message || "No se pudo cargar la información del autor");
                toast.error("Error al cargar autor");
            } finally {
                setLoading(false);
            }
        };

        fetchAuthor();
    }, [cedula]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-light-300">Cargando autor...</span>
            </div>
        );
    }

    if (error || !author) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-red-500">Error</h2>
                <p className="text-slate-700">{error || "No se encontró el autor"}</p>
                <Button
                    onClick={() => router.push('/admin/authors')}
                    className="mt-4"
                >
                    Volver a autores
                </Button>
            </div>
        );
    }

    return (
        <ProtectedRoute adminOnly>
            <section className="w-full max-w-2xl bg-white rounded-2xl p-7 shadow-sm">
                <AuthorForm initialData={author} />
            </section>
        </ProtectedRoute>
    );
};

export default EditAuthorPage;