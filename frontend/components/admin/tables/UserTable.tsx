// components/admin/tables/UserTable.tsx
"use client";

import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { memo, useCallback, useMemo, useState } from "react";
import Loader from './Loader';

interface Props {
  users: Usuario[];
  loading?: boolean;
  onDelete?: (id: number) => Promise<void | boolean>;
}

const UserTable = ({ users, loading, onDelete }: Props) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ field: "userName", dir: "asc" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: 0, loading: false });

  // Filtrar y ordenar usuarios
  const filteredUsers = useMemo(() => {
    if (loading) return [];
    
    const term = search.toLowerCase();
    return [...users]
      .filter(u => !term || 
        u.userName.toLowerCase().includes(term) || 
        u.tipo.toLowerCase().includes(term) ||
        String(u.id).includes(term)
      )
      .sort((a, b) => {
        const field = sort.field as keyof Usuario;
        const valA = a[field] || "";
        const valB = b[field] || "";
        const result = String(valA).localeCompare(String(valB));
        return sort.dir === "asc" ? result : -result;
      });
  }, [users, search, sort, loading]);

  // Manejar eliminación
  const handleDelete = useCallback(async () => {
    if (!onDelete || !deleteDialog.id) return;
    
    setDeleteDialog(d => ({ ...d, loading: true }));
    try {
      await onDelete(deleteDialog.id);
      setDeleteDialog({ open: false, id: 0, loading: false });
    } catch (error) {
      console.error(error);
      setDeleteDialog(d => ({ ...d, loading: false }));
    }
  }, [deleteDialog.id, onDelete]);

  // Componente de carga
  if (loading) {
    return (  
    <Loader />
    
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar usuario..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <p className="text-sm text-slate-500">
          {search ? `${filteredUsers.length} resultados` : `${users.length} usuarios`}
        </p>
      </div>

      {/* Tabla */}
      <div className="rounded-lg border overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-blue-50">
            <TableRow>
              {[
                { key: 'id', label: 'ID' },
                { key: 'userName', label: 'Usuario' },
                { key: 'tipo', label: 'Rol' }
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <TableRow key={user.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono">{user.id}</TableCell>
                  <TableCell className="font-medium">{user.userName}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.tipo === 'ADMINISTRADOR' ? 'default' : 'outline'}
                      className={user.tipo === 'ADMINISTRADOR' 
                        ? 'bg-primary-admin text-white' 
                        : 'bg-slate-50 text-slate-700'
                      }
                    >
                      {user.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-slate-500 hover:text-amber-500"
                        asChild
                      >
                        <Link href={`/admin/users/edit/${user.id}`}>
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
                            id: user.id, 
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
                  {search ? "No se encontraron usuarios" : "No hay usuarios disponibles"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de confirmación */}
      <DeleteDialog
        open={deleteDialog.open}
        onOpenChange={open => setDeleteDialog(d => ({ ...d, open }))}
        onConfirm={handleDelete}
        isDeleting={deleteDialog.loading}
        title="¿Eliminar este usuario?"
        description="Esta acción no se puede deshacer. El usuario será eliminado permanentemente."
      />
    </div>
  );
};

export default memo(UserTable);