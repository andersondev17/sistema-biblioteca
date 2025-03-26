"use client";

import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Search, Shield, User, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import SortableHeader from "./SortableHeader";

interface Usuario {
  id: number;
  userName: string;
  tipo: string;
}

interface UserTableProps {
  users: Usuario[];
  onDelete: (id: number) => Promise<void>;
}

export default function UserTable({ users, onDelete }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ field: keyof Usuario; dir: "asc" | "desc" }>({
    field: "userName",
    dir: "asc"
  });
  const [deleteState, setDeleteState] = useState<{ open: boolean; userId?: number; isDeleting?: boolean }>({
    open: false,
    isDeleting: false
  });

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users
      .filter(user => 
        !searchTerm || 
        [user.userName, user.tipo, user.id.toString()].some(f => f.toLowerCase().includes(term))
      )
      .sort((a, b) => {
        const valA = String(a[sortConfig.field]);
        const valB = String(b[sortConfig.field]);
        return sortConfig.dir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
  }, [users, searchTerm, sortConfig]);

  const handleDelete = async () => {
    if (!deleteState.userId) return;

    try {
      setDeleteState(prev => ({ ...prev, isDeleting: true }));
      await onDelete(deleteState.userId);
      toast.success('Usuario eliminado exitosamente');
    } catch {
      toast.error('Error al eliminar el usuario');
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
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-slate-200 focus-visible:ring-primary-admin"
          />
        </div>
        <div className="text-sm text-slate-500">
          {searchTerm ? `${filteredUsers.length} resultados` : `Total: ${users.length} usuarios`}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-blue-200">
            <TableRow>
              {['id', 'userName', 'tipo'].map((field) => (
                <SortableHeader
                  key={field}
                  field={field}
                  currentField={sortConfig.field}
                  direction={sortConfig.dir}
                  onClick={(f) => setSortConfig(prev => ({
                    field: f as keyof Usuario,
                    dir: prev.field === f && prev.dir === "asc" ? "desc" : "asc"
                  }))}
                >
                  {{
                    id: 'ID',
                    userName: 'Usuario',
                    tipo: 'Rol'
                  }[field]}
                </SortableHeader>
              ))}
              <TableHead className="text-right text-primary-admin font-medium">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-slate-600">{user.id}</TableCell>
                <TableCell className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-700">{user.userName}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.tipo === 'ADMINISTRADOR' ? 'default' : 'outline'}
                    className={user.tipo === 'ADMINISTRADOR' 
                      ? 'bg-primary-admin text-white' 
                      : 'bg-slate-50 text-slate-700 border-slate-200'}
                  >
                    {user.tipo === 'ADMINISTRADOR' && <Shield className="h-3 w-3 mr-1" />}
                    {user.tipo}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="ghost" size="sm" className="h-8 text-primary-admin hover:bg-blue-100">
                      <Link href={`/admin/users/edit/${user.id}`}>
                        <Edit size={16} className="mr-1" /> Editar
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-gray-400 hover:bg-red-100"
                      onClick={() => setDeleteState({ open: true, userId: user.id })}
                    >
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
        isDeleting={deleteState.isDeleting ?? false}
        title="¿Confirma eliminar este usuario?"
        description="Esta acción no se puede deshacer. El usuario será eliminado permanentemente."
      />
    </div>
  );
}