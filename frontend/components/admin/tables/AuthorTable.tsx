"use client";

import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, FileEdit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface Autor {
    cedula: string;
    nombreCompleto: string;
    nacionalidad: string;
}

interface AuthorTableProps {
    authors: Autor[];
    onDelete: (cedula: string) => Promise<void>;
}

export default function AuthorTable({ authors, onDelete }: AuthorTableProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (cedula: string) => {
        setAuthorToDelete(cedula);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!authorToDelete) return;

        setIsDeleting(true);
        try {
            await onDelete(authorToDelete);
            toast.success('Autor eliminado exitosamente');
            setDeleteDialogOpen(false);
        } catch (error) {
            toast.error('Error al eliminar el autor');
        } finally {
            setIsDeleting(false);
            setAuthorToDelete(null);
        }
    };

    return (
        <>
            <div className="mt-4 w-full overflow-hidden rounded-md border border-light-400/50">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cédula</TableHead>
                                <TableHead>Nombre Completo</TableHead>
                                <TableHead>Nacionalidad</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {authors.map((author) => (
                                <TableRow key={author.cedula} className="hover:bg-slate-50/80">
                                    <TableCell className="font-medium">{author.cedula}</TableCell>
                                    <TableCell>{author.nombreCompleto}</TableCell>
                                    <TableCell>{author.nacionalidad}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-slate-500 hover:text-blue-500"
                                                asChild
                                            >
                                                <Link href={`/reports/authors/${author.cedula}`}>
                                                    <BookOpen className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-slate-500 hover:text-amber-500"
                                                asChild
                                            >
                                                <Link href={`/admin/authors/edit/${author.cedula}`}>
                                                    <FileEdit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-slate-500 hover:text-red-500"
                                                onClick={() => handleDeleteClick(author.cedula)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
                title="¿Confirma eliminar este autor?"
                description="Esta acción no se puede deshacer. El autor y su asociación con los libros será eliminada permanentemente."
            />
        </>
    );
}