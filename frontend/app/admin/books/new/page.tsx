"use client";

import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const BookForm = dynamic(() => import("@/components/admin/forms/BookForm"), {
    loading: () => <BookFormSkeleton />,
    ssr: false 
});

const BookFormSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
        </div>
        <div className="flex justify-end gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
        </div>
    </div>
);

const NewBookPage = () => (
    <div className="w-full p-4">
        <section className="w-full bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 md:p-7 shadow-sm">
            <Suspense fallback={<BookFormSkeleton />}>
                <BookForm />
            </Suspense>
        </section>
    </div>
);

export default NewBookPage;