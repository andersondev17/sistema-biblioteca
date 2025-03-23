"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn, getAvatarColor, getInitials } from "@/lib/utils";
import AuthService from "@/services/auth.service";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
    const router = useRouter();
    const [user, setUser] = useState<{ userName: string; tipo: string } | null>(null);
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);

        // Determinar saludo según hora del día
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Buenos días");
        else if (hour < 18) setGreeting("Buenas tardes");
        else setGreeting("Buenas noches");
    }, []);

    const handleLogout = async () => {
        await AuthService.logout();
        router.push('/login');
    };

    return (
        <header className="w-full sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm py-4 px-6">
            <div className="flex items-center justify-between">
                {/* Saludo y contexto */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-slate-500 lg:text-2xl">
                            {greeting}, <span className="text-primary-admin">{user?.userName}</span>
                        </h2>
                        {user?.tipo === "ADMINISTRADOR" && (
                            <span className="bg-primary-admin/10 text-primary-admin text-xs font-medium px-2 py-0.5 rounded-full">
                                Admin
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        {user?.tipo === "ADMINISTRADOR"
                            ? "Gestiona usuarios, autores y libros desde aquí"
                            : "Consulta información de autores y libros"}
                    </p>
                </div>

                {/* Acciones rápidas */}
                <div className="flex items-center gap-4">
                    
                    {/* Menú de usuario */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-colors">
                                <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                    <AvatarFallback className={cn(getAvatarColor(user?.userName || ""))}>
                                        {getInitials(user?.userName || "Usuario")}
                                    </AvatarFallback>
                                </Avatar>
                                <Settings className="h-4 w-4 text-slate-400" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-1">
                            <DropdownMenuItem onClick={() => router.push('/profile')}>
                                Mi Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/settings')}>
                                Configuración
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="text-red-500 focus:text-red-500"
                            >
                                Cerrar Sesión
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default Header;