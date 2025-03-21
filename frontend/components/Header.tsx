'use client'

import { cn, getAvatarColor, getInitials } from "@/lib/utils";
import AuthService from "@/services/auth.service";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "./ui/dropdown-menu";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{userName: string; tipo: string} | null>(null);
  
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    router.push('/login');
  };

  const isAdmin = user?.tipo === 'ADMINISTRADOR';

  return (
    <header className="my-10 flex justify-between gap-5 text-2xl text-blue-50 font-bebas-neue">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            href="/library"
            className={cn(
              'text-base cursor-pointer capitalize',
              pathname === '/library' ? 'text-light-200' : 'text-light-100',
            )}>
            Library
          </Link>
        </li>
        
        {isAdmin && (
          <li>
            <Link
              href="/admin"
              className={cn(
                'text-base cursor-pointer capitalize',
                pathname.startsWith('/admin') ? 'text-light-200' : 'text-light-100',
              )}>
              Admin
            </Link>
          </li>
        )}

        {user && (
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarFallback className={getAvatarColor(user.userName)}>
                    {getInitials(user.userName)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-dark-300 border-dark-600 text-light-100">
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/profile')}>
                  Mi Perfil
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/register')}>
                    Registrar Usuario
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-400" onClick={handleLogout}>
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        )}
      </ul>
    </header>
  )
}

export default Header