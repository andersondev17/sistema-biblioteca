"use client";

import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import SortableHeader from "./SortableHeader";

interface Autor {
    cedula: string;
    nombreCompleto: string;
    nacionalidad: string;
}

interface AuthorTableProps {
    authors: Autor[];
    onDelete?: (cedula: string) => Promise<void>;
}
export default function AuthorTable({ authors, onDelete }: AuthorTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ field: keyof Autor; dir: "asc" | "desc" }>({
        field: "nombreCompleto",
        dir: "asc"
    });
    const [deleteState, setDeleteState] = useState<{ open: boolean; cedula?: string; isDeleting: boolean }>({
        open: false,
        isDeleting: false
    });
    const filteredAuthors = useMemo(() => {
        const term = searchTerm.toLowerCase();
        const filtered = authors.filter(author =>
            !searchTerm || [
                author.nombreCompleto.toLowerCase(),
                author.nacionalidad.toLowerCase(),
                author.cedula
            ].some(field => field.includes(term))
        );
        return [...filtered].sort((a, b) =>
            sortConfig.dir === "asc"
                ? a[sortConfig.field].localeCompare(b[sortConfig.field])
                : b[sortConfig.field].localeCompare(a[sortConfig.field]));
    }, [authors, searchTerm, sortConfig]);

    const handleDelete = async () => {
        if (!deleteState.cedula || !onDelete) return;

        try {
            setDeleteState(prev => ({ ...prev, isDeleting: true }));
            await onDelete(deleteState.cedula);
            toast.success('Autor eliminado exitosamente');
        } catch {
            toast.error('Error al eliminar el autor');
        } finally {
            setDeleteState({ open: false, isDeleting: false });
        }
    };
    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
                <div className="relative w-full sm:w-64 md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Buscar autor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white border-slate-200 focus-visible:ring-primary-admin"
                    />
                </div>
                <div className="text-sm text-slate-500">
                    {searchTerm ? `${filteredAuthors.length} resultados` : `Total: ${authors.length} autores`}
                </div>
            </div>

            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-blue-200">
                        <TableRow>
                            {["cedula", "nombreCompleto", "nacionalidad"].map((field) => (
                                <SortableHeader
                                    key={field}
                                    field={field}
                                    currentField={sortConfig.field}
                                    direction={sortConfig.dir}
                                    onClick={(f) => setSortConfig(prev => ({
                                        field: f as keyof Autor,
                                        dir: prev.field === f && prev.dir === "asc" ? "desc" : "asc"
                                    }))}
                                >
                                    {field === "cedula" ? "Cédula" : field === "nombreCompleto" ? "Nombre Completo" : "Nacionalidad"}
                                </SortableHeader>
                            ))}
                            <TableHead className="text-right text-primary-admin font-medium">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAuthors.map((author) => (
                            <TableRow key={author.cedula} className="hover:bg-slate-50">
                                <TableCell className="font-mono text-slate-600">{author.cedula}</TableCell>
                                <TableCell className="font-medium text-slate-700">{author.nombreCompleto}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        color="primary"
                                        className="text-primary-admin">
                                        {author.nacionalidad}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button asChild variant="ghost" size="sm" className="h-8 rounded-md text-primary-admin hover:bg-blue-100">
                                            <Link href={`/admin/authors/edit/${author.cedula}`}>
                                                <Edit size={16} className="mr-1" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 rounded-md text-gray-400 hover:bg-red-100"
                                            onClick={() => setDeleteState({ open: true, cedula: author.cedula, isDeleting: false })}                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <DeleteDialog
                open={deleteState.open}
                onOpenChange={(open) => setDeleteState(prev => ({ ...prev, open }))}
                onConfirm={handleDelete}
                isDeleting={deleteState.isDeleting}
                title="¿Confirma eliminar este autor?"
                description="Esta acción no se puede deshacer. El autor y su asociación con los libros será eliminada permanentemente."
            />
        </>
    );
}