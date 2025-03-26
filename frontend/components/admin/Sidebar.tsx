"use client";

import { adminSideBarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import AuthService from "@/services/auth.service";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ userName: string; tipo: string } | null>(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  return (
    <aside className="sticky left-0 top-0 flex h-dvh flex-col justify-between bg-white/95 backdrop-blur-sm px-5 pb-5 pt-10 shadow-sm border-r  rounded-r-[70px]  shadow-primary-admin py-8  transition-all duration-300 border border-light-400/30">
      <div>
        <Link href="/">
          <div className="flex flex-row items-center gap-2 border-b border-dashed border-primary-admin/20 pb-10 max-md:justify-center cursor-pointer group">
            <Image
              src="/icons/admin/logo.svg"
              alt="logo"
              height={37}
              width={37}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <h1 className="text-2xl font-bebas-neue font-semibold text-primary-admin max-md:hidden group-hover:text-primary-admin/80 transition-colors duration-300">
              Libreria
            </h1>
          </div>
        </Link>

        {/* Links de navegación */}
        <nav className="mt-10 flex flex-col gap-5">
          {adminSideBarLinks.map((link) => {
            const isSelected = 
              pathname === link.route || 
              (link.route !== "/admin" && pathname.includes(link.route) && link.route.length > 1);

            return (
              <Link href={link.route} key={link.route}>
                <div className={cn(
                  "flex flex-row items-center w-full gap-2 rounded-lg px-5 py-3.5 max-md:justify-center transition-all duration-200",
                  isSelected 
                    ? "bg-primary-admin shadow-md shadow-primary-admin/10" 
                    : "hover:bg-blue-200"
                )}>
                  <div className="relative size-5">
                    <Image
                      src={link.img}
                      alt={link.text}
                      fill
                      className={cn(
                        "object-contain transition-all duration-200", 
                        isSelected ? "brightness-0 invert" : "opacity-80"
                      )}
                    />
                  </div>
                  <p className={cn(
                    "text-base font-medium max-md:hidden transition-colors duration-200",
                    isSelected ? "text-white" : "text-dark"
                  )}>
                    {link.text}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Perfil de usuario */}
      {user && (
        <div className="my-8 flex w-full flex-row gap-3 rounded-full border border-light-400 px-6 py-3 shadow-sm hover:shadow-md transition-shadow duration-300 max-md:px-2 hover:border-primary-admin/30">
          <div className="flex flex-col max-md:hidden">
            <p className="font-semibold text-dark-200 truncate">{user.userName}</p>
            <p className="text-xs text-light-500 truncate">
              {user.tipo === 'ADMINISTRADOR' ? 'Administrador' : 'Empleado'}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;