"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
        <header className="w-full sticky top-0 z-10 backdrop-blur-sm shadow-sm py-3 sm:py-4 px-3 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-bebas-neue font-semibold text-slate-500 lg:text-2xl truncate">
                            {greeting}, <span className="text-primary-admin">{user?.userName} 👋</span>
                        </h2>
                        {user?.tipo === "ADMINISTRADOR" && (
                            <span className="bg-primary-admin/10 font-bebas-neue text-primary-admin text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                                Admin
                            </span>
                        )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1 sm:line-clamp-none">
                        {user?.tipo === "ADMINISTRADOR"
                            ? "Bienvenido al panel de administración de la biblioteca"
                            : "Consulta información de autores y libros"}
                    </p>
                </div>

                <div className="flex items-center justify-end mt-2 sm:mt-0">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2 cursor-pointer border-light-400 px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300 border hover:border-primary-admin/30">
                                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-white shadow-sm">
                                    <AvatarFallback className={cn(getAvatarColor(user?.userName || ""))}>
                                        {getInitials(user?.userName || "Usuario")}
                                    </AvatarFallback>
                                </Avatar>
                                <Settings className="h-4 w-4 text-slate-400" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 sm:w-56 mt-1 font-ibm-plex-sans border bg-white border-light-400 py-3 shadow-sm transition-shadow duration-300 hover:shadow-md">
                            <DropdownMenuItem className="hover:bg-light-400 text-sm sm:text-base px-3 py-2" onClick={() => router.push('/profile')}>
                                Mi Perfil
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="text-red-500 hover:bg-light-400 text-sm sm:text-base px-3 py-2"
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