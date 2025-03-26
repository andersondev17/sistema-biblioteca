"use client";

import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import BookService from "@/services/book.service";
import { Edit, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import SortableHeader from "./SortableHeader";

interface BookTableProps {
    books: LibroView[];
    authors: Autor[];
}
const BookTable = ({ books, authors }: BookTableProps) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ field: string; dir: "asc" | "desc" }>({
        field: "editorial",
        dir: "asc"
    });
    const [deleteState, setDeleteState] = useState<{ open: boolean; isbn?: string; isDeleting?: boolean }>({
        open: false,
        isDeleting: false
    });

    const authorMap = useMemo(() => new Map(authors.map(a => [a.cedula, a])), [authors]);

    const filteredBooks = useMemo(() => {
        const term = searchTerm.toLowerCase();
        const sortedField = sortConfig.field;

        return books
            .filter(book => !searchTerm || [
                book.editorial,
                book.genero,
                authorMap.get(book.autorCedula)?.nombreCompleto,
                String(book.anoPublicacion)
            ].some(v => v?.toLowerCase().includes(term)))
            .sort((a, b) => {
                const valA = sortedField === "autor" 
                    ? authorMap.get(a.autorCedula)?.nombreCompleto || ""
                    : a[sortedField as keyof LibroView];
                
                const valB = sortedField === "autor" 
                    ? authorMap.get(b.autorCedula)?.nombreCompleto || ""
                    : b[sortedField as keyof LibroView];

                return sortConfig.dir === "asc" 
                    ? String(valA).localeCompare(String(valB))
                    : String(valB).localeCompare(String(valA));
            });
    }, [books, searchTerm, sortConfig, authorMap]);

    const handleDelete = async () => {
        if (!deleteState.isbn) return;

        try {
            setDeleteState(prev => ({ ...prev, isDeleting: true }));
            await BookService.deleteBook(deleteState.isbn);
            toast.success("Libro eliminado exitosamente");
            router.refresh();
        } catch {
            toast.error("No se pudo eliminar el libro");
        } finally {
            setDeleteState({ open: false, isDeleting: false });
        }
    };

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
                    <TableHeader className="bg-blue-200">
                        <TableRow>
                            {['editorial', 'genero', 'anoPublicacion', 'autor'].map((field) => (
                                <SortableHeader
                                    key={field}
                                    field={field}
                                    currentField={sortConfig.field}
                                    direction={sortConfig.dir}
                                    onClick={(f) => setSortConfig(prev => ({
                                        field: f,
                                        dir: prev.field === f && prev.dir === "asc" ? "desc" : "asc"
                                    }))}
                                >
                                    {{
                                        editorial: 'Título',
                                        genero: 'Género',
                                        anoPublicacion: 'Año',
                                        autor: 'Autor'
                                    }[field]}
                                </SortableHeader>
                            ))}
                            <TableHead className="text-right text-primary-admin font-medium">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBooks.map(book => {
                            const author = authorMap.get(book.autorCedula);
                            return (
                                <TableRow key={book.isbn} className="hover:bg-slate-50">
                                    <TableCell className="font-medium text-slate-700">{book.editorial}</TableCell>
                                    <TableCell><Badge variant="outline">{book.genero}</Badge></TableCell>
                                    <TableCell className="font-mono">{book.anoPublicacion}</TableCell>
                                    <TableCell className="text-slate-700 hover:text-primary-admin transition-colors">
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
                                                className="h-8 text-gray-400 hover:bg-red-100"
                                                onClick={() => setDeleteState({ open: true, isbn: book.isbn })}
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <DeleteDialog
                open={deleteState.open}
                onOpenChange={(open) => setDeleteState(prev => ({ ...prev, open }))}
                onConfirm={handleDelete}
                isDeleting={deleteState.isDeleting ?? false}
                title="¿Confirma eliminar este libro?"
                description="Esta acción no se puede deshacer. El libro será eliminado permanentemente."
            />
        </div>
    );
};

export default BookTable;