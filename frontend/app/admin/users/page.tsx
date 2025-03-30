"use client";

import UserTable from "@/components/admin/tables/UserTable";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/hooks/useUsers";
import { Plus } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { toast } from "sonner";

function UsersPage() {
  const { users, loading, deleteUser } = useUsers();

  const handleDelete = async (id: number) => {
    const success = await deleteUser(id);
    toast[success ? 'success' : 'error'](
      success ? "Usuario eliminado exitosamente" : "Error al eliminar usuario"
    );
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/users/new" className="flex items-center gap-2 bg-primary-admin hover:bg-primary-admin/90 text-white">
            <Plus size={16} />
            <span>Nuevo Usuario</span>
          </Link>
        </Button>
      </div>
      
      <UserTable 
        users={users} 
        onDelete={handleDelete}
      />
    </div>
  );
}

export default memo(UsersPage);