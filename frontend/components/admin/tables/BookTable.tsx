"use client";

import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import BookService from "@/services/book.service";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
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
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[100px]">Portada</TableHead>
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
                                        <TableCell>
                                            {book.cover ? (
                                                <div className="relative h-14 w-10 overflow-hidden rounded">
                                                    <Image
                                                        src={book.cover}
                                                        alt={book.editorial}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-14 w-10 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                                                    N/A
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{book.editorial}</TableCell>
                                        <TableCell>{book.genero}</TableCell>
                                        <TableCell>{book.anoPublicacion}</TableCell>
                                        <TableCell>{author?.nombreCompleto || 'Autor desconocido'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => router.push(`/admin/books/edit/${book.isbn}`)}
                                                    title="Editar"
                                                >
                                                    <Edit size={16} className="text-gray-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(book.isbn)}
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} className="text-red-500" />
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