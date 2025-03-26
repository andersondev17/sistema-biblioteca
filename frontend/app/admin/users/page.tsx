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

  const deleteUser = async (id: number) => {
    await UserService.deleteUser(id);
    fetchUsers(); // Recargar la lista
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
        <Button asChild>
          <Link href="/admin/users/new" className="flex items-center gap-2 bg-primary-admin hover:bg-blue-300 text-white px-4 py-2 rounded-lg">
            <Plus size={16} />
            Nuevo Usuario
          </Link>
        </Button>
      </div>
      <UserTable users={users} onDelete={deleteUser} />
    </div>
  );
}