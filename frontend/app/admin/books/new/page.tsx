"use client";

import AuthorForm from "@/components/admin/forms/AuthorForm";
import BookForm from "@/components/admin/forms/BookForm";

const NewBookPage = () => {
    return (


        <div className="grid grid-cols-2 gap-4">

            <section className="w-full max-w-2xl bg-white rounded-2xl p-7 shadow-sm">

                <BookForm />
            </section>
            <section className="w-full max-w-2xl bg-white rounded-2xl p-7 shadow-sm">
                <h2 className="text-xl font-semibold text-dark-400 mb-6">Anadir un nuevo Autor </h2>

                <AuthorForm />
            </section>
        </div>

    );
};

export default NewBookPage;