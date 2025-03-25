// UserTable.tsx
"use client";

import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(userToDelete);
      toast.success('Usuario eliminado exitosamente');
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Error al eliminar el usuario');
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <div className="mt-4 w-full overflow-hidden rounded-md border border-light-400/50">
        <div className="border rounded-lg overflow-hidden">
          <Table>
          <TableHeader className=" bg-blue-200">
          <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/80">
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.tipo === 'ADMINISTRADOR' ? 'default' : 'outline'}
                      className={user.tipo === 'ADMINISTRADOR'
                        ? 'bg-primary-admin text-white'
                        : 'bg-slate-50'
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
                        className="h-8 w-8 text-slate-500 hover:text-blue-500"
                        asChild
                      >
                        <Link href={`/admin/users/edit/${user.id}`}>
                        <p className="text-xs">Edit</p>
                        <Edit size={16} className="text-primary-admin" />
                                                </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-slate-500 hover:text-red-500"
                        onClick={() => handleDeleteClick(user.id)}
                      >
                        <X size={16}  />

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
        title="¿Confirma eliminar este usuario?"
        description="Esta acción no se puede deshacer. El usuario será eliminado permanentemente."
      />
    </>
  );
}