'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import AuthService from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserProfile {
    id: number;
    userName: string;
    tipo: 'ADMINISTRADOR' | 'EMPLEADO';
}

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
    }, []);

    const handleLogout = async () => {
        await AuthService.logout();
        router.push('/login');
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col gap-6">
                <h1 className="text-3xl font-semibold text-white">Mi Perfil</h1>

                {user && (
                    <div className="rounded-lg bg-dark-600 p-6">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-dark-100">
                                {user.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">{user.userName}</h2>
                                <p className="text-light-100">{user.tipo}</p>
                            </div>
                        </div>

                        <div className="mb-6 grid gap-4 md:grid-cols-2">
                            <div className="rounded-md bg-dark-700 p-4">
                                <p className="text-sm text-light-100">ID de Usuario</p>
                                <p className="text-lg font-medium text-white">{user.id}</p>
                            </div>

                            <div className="rounded-md bg-dark-700 p-4">
                                <p className="text-sm text-light-100">Tipo de Cuenta</p>
                                <p className="text-lg font-medium text-white">
                                    {user.tipo === 'ADMINISTRADOR' ? 'Administrador' : 'Empleado'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {user.tipo === 'ADMINISTRADOR' && (
                                <Button
                                    onClick={() => router.push('/register')}
                                    className="bg-secondary hover:bg-secondary/80"
                                >
                                    Registrar Usuario
                                </Button>
                            )}

                            <Button
                                onClick={handleLogout}
                                className="bg-primary hover:bg-primary/80"

                            >
                                Cerrar Sesión
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
};

export default ProfilePage;