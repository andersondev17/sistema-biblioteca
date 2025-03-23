'use client';

import Header from '@/components/admin/Header';
import Sidebar from '@/components/admin/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import '@/styles/admin.css';
import { ReactNode } from 'react';

const AdminLayout = ({ children }: { children: ReactNode }) => {
    return (
        <ProtectedRoute adminOnly={true}>
            <main className='flex min-h-screen bg-slate-50'>
                <Sidebar />
                <div className='flex flex-col flex-1 overflow-x-hidden'>
                    <Header />

                    <div className='flex-1 p-6'>
                        {children}
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
};

export default AdminLayout;