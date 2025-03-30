'use client';
import Header from '@/components/admin/Header';
import Sidebar from '@/components/admin/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LoadingBar } from '@/components/ui/LoadingBar';
import { useLoading } from '@/contexts/LoadingContext';
import '@/styles/admin.css';
import { ReactNode } from 'react';

const AdminLayout = ({ children }: { children: ReactNode }) => {
    const { isLoading } = useLoading();

    return (
        <ProtectedRoute adminOnly={true}>
            <main className='flex min-h-screen bg-slate-50'>
                <Sidebar />
                <div className='flex flex-col flex-1 overflow-x-hidden'>
                    <Header />
                    {isLoading && <LoadingBar />} 
                    <div className='flex-1 p-6'>
                        {children}
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
};

export default AdminLayout;