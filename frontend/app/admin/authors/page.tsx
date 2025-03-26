"use client";

import AuthorTable from "@/components/admin/tables/AuthorTable";
import { Button } from "@/components/ui/button";
import AuthorService from "@/services/author.service";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AuthorsPage() {
    const [authors, setAuthors] = useState<Autor[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            const authorsData = await AuthorService.getAllAuthors();
            setAuthors(authorsData);
        } catch (error) {
            console.error("Error cargando autores:", error);
            toast.error("Error cargando datos");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAuthor = async (cedula: string) => {
        try {
            await AuthorService.deleteAuthor(cedula);

            // para actualizar el cambio live
            setAuthors(prevAuthors => prevAuthors.filter(author => author.cedula !== cedula));

            toast.success("Autor eliminado exitosamente");
        } catch (error) {
            console.error("Error al eliminar autor:", error);
            toast.error("Error al eliminar autor");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <h1 className="text-2xl font-bold">Gestión de Autores</h1>
                <Button asChild>
                    <Link href="/admin/authors/new" className="flex items-center gap-2 bg-primary-admin hover:bg-blue-300 text-white px-4 py-2 rounded-md shadow-sm sm:w-auto">
                        <Plus size={16} />
                        Nuevo Autor
                    </Link>
                </Button>
            </div>
            {/* Pasar la función handleDeleteAuthor como prop onDelete */}
            <AuthorTable
                authors={authors}
                onDelete={handleDeleteAuthor}
            />
        </div>
    );
}