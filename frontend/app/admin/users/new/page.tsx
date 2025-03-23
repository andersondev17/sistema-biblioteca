"use client";

import UserForm from "@/components/admin/forms/UserForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const NewBookPage = () => {
    return (
        <>
            <Button
                asChild
                className="pt-4mb-10 w-fit border border-light-300 bg-white text-xs font-medium text-dark-200 hover:bg-light-300 transition-colors rounded-md px-4 py-2 shadow-sm"
            >
                <Link href="/admin/books" className="flex items-center gap-2">
                    <ArrowLeft size={14} />
                    Volver
                </Link>
            </Button>

            <section className="w-full max-w-2xl bg-white rounded-2xl p-7 shadow-sm">
                <UserForm />
            </section>
        </>
    );
};

export default NewBookPage;