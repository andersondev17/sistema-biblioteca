"use client";

import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Search, X } from "lucide-react";
import Link from "next/link";
import { memo, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import Loader from "./Loader";
import SortableHeader from "./SortableHeader";

// Interfaz de props utilizando los tipos globales
interface BookTableProps {
    books: LibroView[];
    authors: Autor[];
    loading?: boolean;
    onDelete?: (isbn: string) => Promise<boolean | void>;
}

const BookTable = ({ books, authors, loading = false, onDelete }: BookTableProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ field: string; dir: "asc" | "desc" }>({
        field: "editorial",
        dir: "asc"
    });
    const [deleteState, setDeleteState] = useState<{ open: boolean; isbn: string; isDeleting: boolean }>({
        open: false,
        isbn: "",
        isDeleting: false
    });

    // Crear mapa de autores una sola vez
    const authorMap = useMemo(() => {
        const map = new Map<string, Autor>();
        authors.forEach(author => map.set(author.cedula, author));
        return map;
    }, [authors]);

    // Filtrado y ordenación de libros
    const filteredBooks = useMemo(() => {
        if (loading) return [];

        const term = searchTerm.toLowerCase();
        const sortedField = sortConfig.field;

        return books
            .filter(book => !term || [
                book.editorial,
                book.genero,
                authorMap.get(book.autorCedula)?.nombreCompleto,
                String(book.anoPublicacion)
            ].some(v => v?.toLowerCase().includes(term)))
            .sort((a, b) => {
                let valA: any, valB: any;

                if (sortedField === "autor") {
                    valA = authorMap.get(a.autorCedula)?.nombreCompleto || "";
                    valB = authorMap.get(b.autorCedula)?.nombreCompleto || "";
                } else if (sortedField === "anoPublicacion") {
                    // Comparación numérica para años
                    return sortConfig.dir === "asc"
                        ? a.anoPublicacion - b.anoPublicacion
                        : b.anoPublicacion - a.anoPublicacion;
                } else {
                    valA = a[sortedField as keyof LibroView] || "";
                    valB = b[sortedField as keyof LibroView] || "";
                }

                return sortConfig.dir === "asc"
                    ? String(valA).localeCompare(String(valB))
                    : String(valB).localeCompare(String(valA));
            });
    }, [books, searchTerm, sortConfig, authorMap, loading]);

    // Manejador de eliminación de libro
    const handleDelete = useCallback(async () => {
        if (!deleteState.isbn || !onDelete) return;

        try {
            setDeleteState(prev => ({ ...prev, isDeleting: true }));
            await onDelete(deleteState.isbn);
            setDeleteState({ open: false, isbn: "", isDeleting: false });
        } catch (error) {
            console.error("Error al eliminar libro:", error);
            toast.error("Error al eliminar el libro");
            setDeleteState(prev => ({ ...prev, isDeleting: false }));
        }
    }, [deleteState.isbn, onDelete]);

    // Estado de carga
    if (loading) {
        return (
            <Loader />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-64 md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Buscar por título, autor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white border-slate-200 focus-visible:ring-primary-admin"
                    />
                </div>
                <div className="text-sm text-slate-500">
                    {searchTerm ? `${filteredBooks.length} resultados` : `Total: ${books.length} libros`}
                </div>
            </div>

            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-blue-50">
                        <TableRow>
                            {[
                                { field: 'editorial', label: 'Título' },
                                { field: 'genero', label: 'Género' },
                                { field: 'anoPublicacion', label: 'Año' },
                                { field: 'autor', label: 'Autor' }
                            ].map((header) => (
                                <SortableHeader
                                    key={header.field}
                                    field={header.field}
                                    currentField={sortConfig.field}
                                    direction={sortConfig.dir}
                                    onClick={(f) => setSortConfig(prev => ({
                                        field: f,
                                        dir: prev.field === f && prev.dir === "asc" ? "desc" : "asc"
                                    }))}
                                >
                                    {header.label}
                                </SortableHeader>
                            ))}
                            <TableHead className="text-right text-primary-admin font-medium">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBooks.length > 0 ? (
                            filteredBooks.slice(0, 25).map(book => {
                                const author = authorMap.get(book.autorCedula);
                                return (
                                    <TableRow key={book.isbn} className="hover:bg-slate-50">
                                        <TableCell className="font-medium text-slate-700">{book.editorial}</TableCell>
                                        <TableCell><Badge variant="outline">{book.genero}</Badge></TableCell>
                                        <TableCell className="font-mono">{book.anoPublicacion}</TableCell>
                                        <TableCell className="text-slate-700">
                                            {author?.nombreCompleto || 'Autor desconocido'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button asChild variant="ghost" size="sm" className="h-8 text-primary-admin hover:bg-blue-100">
                                                    <Link href={`/admin/books/edit/${book.isbn}`}>
                                                        <Edit size={16} className="mr-1" /> Editar
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 text-gray-400 hover:bg-red-100 hover:text-red-500"
                                                    onClick={() => setDeleteState({ open: true, isbn: book.isbn, isDeleting: false })}
                                                >
                                                    <X size={16} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                    {searchTerm ? "No se encontraron libros" : "No hay libros disponibles"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DeleteDialog
                open={deleteState.open}
                onOpenChange={(open) => setDeleteState(prev => ({ ...prev, open }))}
                onConfirm={handleDelete}
                isDeleting={deleteState.isDeleting}
                title="¿Confirma eliminar este libro?"
                description="Esta acción no se puede deshacer. El libro será eliminado permanentemente."
            />
        </div>
    );
};

export default memo(BookTable);