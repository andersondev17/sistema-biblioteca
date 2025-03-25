"use client";

import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import BookService from "@/services/book.service";
import { Edit, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface BookTableProps {
    books: LibroView[];
    authors: Autor[];
}

const BookTable = ({ books, authors }: BookTableProps) => {
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Crear un mapa para acceder a los autores por cédula más eficientemente
    const authorMap = new Map(authors.map(author => [author.cedula, author]));

    const handleDeleteClick = (isbn: string) => {
        setBookToDelete(isbn);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!bookToDelete) return;

        try {
            setIsDeleting(true);
            await BookService.deleteBook(bookToDelete);
            toast.success("Libro eliminado exitosamente");
            setDeleteDialogOpen(false);
            router.refresh(); // Recargar los datos
        } catch (error) {
            console.error("Error al eliminar libro:", error);
            toast.error("No se pudo eliminar el libro");
        } finally {
            setIsDeleting(false);
            setBookToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-dark-400">Libros disponibles</h2>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-blue-200">
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Género</TableHead>
                            <TableHead>Año</TableHead>
                            <TableHead>Autor</TableHead>
                            <TableHead className="w-[100px] text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {books.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                                    No hay libros registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            books.map((book) => {
                                const author = authorMap.get(book.autorCedula);
                                return (
                                    <TableRow key={book.isbn} className="hover:bg-gray-50">

                                        <TableCell className="font-medium">{book.editorial}</TableCell>
                                        <TableCell>{book.genero}</TableCell>
                                        <TableCell>{book.anoPublicacion}</TableCell>
                                        <TableCell>{author?.nombreCompleto || 'Autor desconocido'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-primary-admin hover:text-blue-300   "
                                                    onClick={() => router.push(`/admin/books/edit/${book.isbn}`)}
                                                    title="Editar"
                                                >
                                                    <p className="text-xs">Edit</p>
                                                    <Edit size={16} className="text-primary-admin" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-500 hover:text-red-500"

                                                    onClick={() => handleDeleteClick(book.isbn)}
                                                    title="Eliminar"
                                                >
                                                    <X size={16}  />
                                                     </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
                title="¿Confirma eliminar este libro?"
                description="Esta acción no se puede deshacer. El libro será eliminado permanentemente."
            />
        </div>
    );
};

export default BookTable;