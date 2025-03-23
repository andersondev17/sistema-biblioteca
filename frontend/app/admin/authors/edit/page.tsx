'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import AuthorTable from "@/components/admin/tables/AuthorTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthorService from "@/services/author.service";
import { Book, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Autor {
    cedula: string;
    nombreCompleto: string;
    nacionalidad: string;
}

export default function AuthorsAdminPage() {
    const [authors, setAuthors] = useState<Autor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAuthors = async () => {
            try {
                const data = await AuthorService.getAllAuthors();
                setAuthors(data);
            } catch (error) {
                console.error("Error al cargar autores:", error);
                toast.error("No se pudieron cargar los autores");
            } finally {
                setLoading(false);
            }
        };

        loadAuthors();
    }, []);

    const handleDelete = async (cedula: string) => {
        try {
            await AuthorService.deleteAuthor(cedula);
            setAuthors(authors.filter(author => author.cedula !== cedula));
        } catch (error) {
            console.error("Error al eliminar autor:", error);
            throw error; // Propagamos el error para que el componente de tabla pueda manejarlo
        }
    };

    return (
        <ProtectedRoute adminOnly>
            <div className="container mx-auto py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Book className="h-8 w-8 text-primary-admin" />
                        <h1 className="text-2xl font-bold text-dark-100">Gestión de Autores</h1>
                    </div>
                    <Link href="/admin/authors/create">
                        <Button className="bg-primary-admin hover:bg-primary-admin/90 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Autor
                        </Button>
                    </Link>
                </div>

                <Card className="border-light-400/50">
                    <CardHeader>
                        <CardTitle className="text-xl text-dark-200">Autores registrados</CardTitle>
                        <CardDescription>
                            Administre los autores de la biblioteca y sus libros asociados
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary-admin" />
                                    <p className="text-sm text-slate-500">Cargando autores...</p>
                                </div>
                            </div>
                        ) : authors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-light-400/50 py-12">
                                <Book className="mb-2 h-12 w-12 text-slate-300" />
                                <h3 className="mb-1 text-lg font-medium text-dark-200">No hay autores</h3>
                                <p className="mb-4 text-sm text-slate-500">
                                    No se encontraron autores registrados en el sistema.
                                </p>
                                <Link href="/admin/authors/create">
                                    <Button className="bg-primary-admin hover:bg-primary-admin/90 text-white">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Registrar primer autor
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <AuthorTable authors={authors} onDelete={handleDelete} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}