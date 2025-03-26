"use client";

import AuthorForm from "@/components/admin/forms/AuthorForm";

const NewBookPage = () => {
    return (


        <div className="w-full p-4">
            <section className="w-full bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 md:p-7 shadow-sm">
                <h2 className="text-xl font-semibold text-dark-400 mb-6">Anadir un nuevo Autor </h2>

                <AuthorForm />
            </section>
        </div>

    );
};

export default NewBookPage;