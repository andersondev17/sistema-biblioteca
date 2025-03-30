'use client';

import UserForm from "@/components/admin/forms/UserForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useUsers } from "@/hooks/useUsers";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { memo } from "react";

const EditUserPage = () => {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;
    const { currentUser, loading } = useUsers(userId);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-admin" />
                <span className="ml-2 text-slate-600">Cargando...</span>
            </div>
        );
    }

    return (
        <ProtectedRoute adminOnly>
            <div className="space-y-6">
                <section className="bg-white rounded-lg p-6 shadow-sm">
                    <UserForm
                        initialData={currentUser}
                        onSuccess={() => router.push('/admin/users')}
                    />
                </section>
            </div>
        </ProtectedRoute>
    );
};

export default memo(EditUserPage);