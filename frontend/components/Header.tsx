'use client'

import { cn } from "@/lib/utils"
import AuthService from "@/services/auth.service"
import { BookIcon, FileText, LogOut, Settings, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ userName: string; tipo: string } | null>(null)
  
  useEffect(() => {
    setUser(AuthService.getCurrentUser())
  }, [])

  const handleLogout = async () => {
    await AuthService.logout()
    router.push('/login')
  }

  const isAdmin = user?.tipo === 'ADMINISTRADOR'
  const navLinks = [
    { href: '/#booklist', label: 'Libros', icon: <BookIcon size={16} /> }
  ]
  return (
    <header className="flex items-center justify-between py-6 transition-all duration-300">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="overflow-hidden rounded-md transition-transform group-hover:scale-110 duration-300">
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={40}
            height={40}
            className="transition-all duration-500 group-hover:brightness-125"
          />
        </div>
        <span className="text-xl font-bold text-light-100 hidden sm:block">Librería</span>
      </Link>

      <div className="flex items-center gap-8">
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 text-base font-medium relative transition-colors duration-300 hover:text-primary group',
                    pathname === link.href ? 'text-primary' : 'text-light-100'
                  )}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Menú de usuario */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-dark-100 font-medium">
                  {user.userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-dark-300" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-dark-300/95 backdrop-blur-lg border-dark-600 text-light-100 min-w-[220px] rounded-xl shadow-lg">
              <div className="px-4 py-3 mb-1 border-b border-dark-600/50">
                <p className="text-sm font-medium">{user.userName}</p>
                <p className="text-xs text-light-500">{user.tipo}</p>
              </div>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="hover:bg-dark-600/50 cursor-pointer" onClick={() => router.push('/profile')}>
                <User size={16} className="mr-2" />
                Mi Perfil
              </DropdownMenuItem>

              {/* Opciones dependiendo en rol */}
              {isAdmin ? (
                <>
                  <DropdownMenuItem className="cursor-pointer hover:bg-dark-600/50" onClick={() => router.push('/admin')}>
                    <Settings size={16} className="mr-2" />
                    Panel de Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-dark-600/50" onClick={() => router.push('/admin/users/new')}>
                    <User size={16} className="mr-2" />
                    Registrar Usuario
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem className="cursor-pointer hover:bg-dark-600/50" onClick={() => router.push('/reports')}>
                  <FileText size={16} className="mr-2" />
                  Reportes de Autores
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-dark-600/50" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 rounded-md bg-primary text-dark-100 font-medium hover:bg-primary/90 transition-all"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header