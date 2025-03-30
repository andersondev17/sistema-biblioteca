'use client';

import AuthorForm from "@/components/admin/forms/AuthorForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/contexts/LoadingContext";
import AuthorService from "@/services/author.service";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { toast } from "sonner";

const EditAuthorPage = () => {
    const params = useParams();
    const router = useRouter();
    const cedula = params.cedula as string;
    const { setLoading: setGlobalLoading } = useLoading();
    
    const [author, setAuthor] = useState<Autor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Activar carga ANTES de montar el componente
    useLayoutEffect(() => {
        setGlobalLoading(true);
    }, [setGlobalLoading]);

    useEffect(() => {
        let isMounted = true;

        const fetchAuthor = async () => {
            if (!cedula) return;
            
            try {
                const authorData = await AuthorService.getAuthorByCedula(cedula);
                if (isMounted) setAuthor(authorData);
            } catch (error: any) {
                if (isMounted) {
                    setError(error.message || "Error cargando autor");
                    toast.error("Error al cargar autor");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setGlobalLoading(false);
                }
            }
        };

        fetchAuthor();

        return () => {
            isMounted = false;
            setGlobalLoading(false);
        };
    }, [cedula, setGlobalLoading]);


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