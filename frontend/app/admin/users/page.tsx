"use client";

import UserTable from "@/components/admin/tables/UserTable";
import { Button } from "@/components/ui/button";
import UserService from "@/services/user.service";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<Usuario[]>([]);
  
  // Obtener usuarios
  const fetchUsers = async () => {
    try {
      const usersData = await UserService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Eliminar usuario
  const deleteUser = async (id: number) => {
    await UserService.deleteUser(id);
    fetchUsers(); // Recargar la lista
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
      <Button asChild>
          <Link href="/admin/users/new" className="flex items-center gap-2">
            <Plus size={16} />
            Nuevo Usuario
          </Link>
        </Button>
      <UserTable users={users} onDelete={deleteUser} />
    </div>
  );
}