// components/admin/tables/AuthorTable.tsx
"use client";

import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { memo, useCallback, useMemo, useState } from "react";
import Loader from "./Loader";

interface Props {
    authors: Autor[];
    loading?: boolean;
    onDelete?: (cedula: string) => Promise<void | boolean>;
}

const AuthorTable = ({ authors, loading, onDelete }: Props) => {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState({ field: "nombreCompleto", dir: "asc" });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, cedula: "", loading: false });

    // Filtrar y ordenar autores
    const filteredAuthors = useMemo(() => {
        if (loading) return [];

        const term = search.toLowerCase();
        return [...authors]
            .filter(a => !term ||
                a.nombreCompleto.toLowerCase().includes(term) ||
                a.nacionalidad.toLowerCase().includes(term) ||
                a.cedula.includes(term)
            )
            .sort((a, b) => {
                const field = sort.field as keyof Autor;
                const valA = a[field] || "";
                const valB = b[field] || "";
                const result = String(valA).localeCompare(String(valB));
                return sort.dir === "asc" ? result : -result;
            });
    }, [authors, search, sort, loading]);

    const handleDelete = useCallback(async () => {
        if (!onDelete || !deleteDialog.cedula) return;

        setDeleteDialog(d => ({ ...d, loading: true }));
        try {
            await onDelete(deleteDialog.cedula);
            setDeleteDialog({ open: false, cedula: "", loading: false });
        } catch (error) {
            console.error(error);
            setDeleteDialog(d => ({ ...d, loading: false }));
        }
    }, [deleteDialog.cedula, onDelete]);

    if (loading) {
        return (
            
            <Loader />
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Buscar autor..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <p className="text-sm text-slate-500">
                    {search ? `${filteredAuthors.length} resultados` : `${authors.length} autores`}
                </p>
            </div>

            <div className="rounded-lg border overflow-hidden bg-white">
                <Table>
                    <TableHeader className="bg-blue-50">
                        <TableRow>
                            {[
                                { key: 'cedula', label: 'Cédula' },
                                { key: 'nombreCompleto', label: 'Nombre' },
                                { key: 'nacionalidad', label: 'Nacionalidad' }
                            ].map(col => (
                                <TableHead
                                    key={col.key}
                                    className="cursor-pointer hover:bg-blue-100"
                                    onClick={() => setSort(prev => ({
                                        field: col.key,
                                        dir: prev.field === col.key && prev.dir === "asc" ? "desc" : "asc"
                                    }))}
                                >
                                    {col.label}
                                    {sort.field === col.key && (sort.dir === "asc" ? " ↑" : " ↓")}
                                </TableHead>
                            ))}
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAuthors.length > 0 ? (
                            filteredAuthors.map(author => (
                                <TableRow key={author.cedula} className="hover:bg-slate-50">
                                    <TableCell className="font-mono">{author.cedula}</TableCell>
                                    <TableCell className="font-medium">{author.nombreCompleto}</TableCell>
                                    <TableCell>{author.nacionalidad}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-slate-500 hover:text-amber-500"
                                                asChild
                                            >
                                                <Link href={`/admin/authors/edit/${author.cedula}`}>
                                                    <Edit size={16} />
                                                </Link>
                                            </Button>
                                            {onDelete && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-slate-500 hover:text-red-500"
                                                    onClick={() => setDeleteDialog({
                                                        open: true,
                                                        cedula: author.cedula,
                                                        loading: false
                                                    })}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                    {search ? "No se encontraron autores" : "No hay autores disponibles"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DeleteDialog
                open={deleteDialog.open}
                onOpenChange={open => setDeleteDialog(d => ({ ...d, open }))}
                onConfirm={handleDelete}
                isDeleting={deleteDialog.loading}
                title="¿Eliminar este autor?"
                description="Esta acción no se puede deshacer. Se eliminará el autor y su relación con los libros."
            />
        </div>
    );
};

export default memo(AuthorTable);