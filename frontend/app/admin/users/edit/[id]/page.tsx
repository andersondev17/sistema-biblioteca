'use client';

import UserForm from "@/components/admin/forms/UserForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import UserService from "@/services/user.service";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EditUserPage = () => {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;

            try {
                setLoading(true);
                const userData = await UserService.getUserById(Number(userId));
                setUser(userData);
            } catch (error: any) {
                console.error("Error al cargar usuario:", error);
                setError(error.message || "No se pudo cargar la información del usuario");
                toast.error("Error al cargar usuario");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-light-300">Cargando usuario...</span>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-red-500">Error</h2>
                <p className="text-slate-700">{error || "No se encontró el usuario"}</p>
                <Button
                    onClick={() => router.push('/admin/users')}
                    className="mt-4"
                >
                    Volver a usuarios
                </Button>
            </div>
        );
    }

    return (
        <ProtectedRoute adminOnly>
            <Button
                asChild
                className="mb-6 w-fit border border-light-300 bg-white text-xs font-medium text-dark-200 hover:bg-light-300 transition-colors rounded-md px-4 py-2 shadow-sm"
            >
            </Button>

            <section className="w-full max-w-2xl bg-white rounded-2xl p-7 shadow-sm">
                <UserForm initialData={user} />
            </section>
        </ProtectedRoute>
    );
};

export default EditUserPage;