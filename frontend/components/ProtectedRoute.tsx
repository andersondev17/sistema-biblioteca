'use client';

import AuthService from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    adminOnly = false
}) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar autenticación
        const checkAuth = () => {
            const isAuth = AuthService.isAuthenticated();
            const isAdmin = AuthService.isAdmin();

            if (!isAuth) {
                router.push('/login');
                return;
            }

            if (adminOnly && !isAdmin) {
                router.push('/');
                return;
            }

            setIsAuthorized(true);
            setLoading(false);
        };

        checkAuth();
    }, [router, adminOnly]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return isAuthorized ? <>{children}</> : null;
};

export default ProtectedRoute;