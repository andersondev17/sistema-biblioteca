'use client';

import UserForm from "@/components/admin/forms/UserForm";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CreateUserPage() {
    return (
        <ProtectedRoute adminOnly>
            <section className="w-full max-w-2xl bg-white rounded-2xl p-7 shadow-sm">
                <UserForm />
            </section>
        </ProtectedRoute>
    );
}