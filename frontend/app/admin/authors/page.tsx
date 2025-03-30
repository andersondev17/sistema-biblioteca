"use client";

import AuthorTable from "@/components/admin/tables/AuthorTable";
import { Button } from "@/components/ui/button";
import { useAuthors } from "@/hooks/useAuthors";
import { Plus } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { toast } from "sonner";

function AuthorsPage() {
    const { authors, loading, deleteAuthor } = useAuthors();

    const handleDelete = async (cedula: string) => {
        const success = await deleteAuthor(cedula);
        toast[success ? 'success' : 'error'](
            success ? "Autor eliminado exitosamente" : "Error al eliminar autor"
        );
    };

    return (
        <div className="space-y-4 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">Gestión de Autores</h1>
                <Button asChild className="w-full sm:w-auto">
                    <Link href="/admin/authors/new" className="flex items-center gap-2 bg-primary-admin hover:bg-primary-admin/90 text-white">
                        <Plus size={16} />
                        <span>Nuevo Autor</span>
                    </Link>
                </Button>
            </div>

            <AuthorTable
                authors={authors}
                loading={loading}
                onDelete={handleDelete}
            />
        </div>
    );
}

export default memo(AuthorsPage);