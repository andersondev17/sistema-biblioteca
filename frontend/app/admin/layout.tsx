'use client'

import AuthService from '@/services/auth.service';
import '@/styles/admin.css';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
    const router = useRouter();

    useEffect(() => {
        if (!AuthService.isAuthenticated()) {
            router.push('/login');
        }
    }, [router]);

    return (
        <main className='flex min-h-screen w-full flex-row'>
            <p>Sidebar</p>

            <div className='admin-container'>
                <p>Header</p>
                {children}
            </div>
        </main>
    )
}

export default layout;