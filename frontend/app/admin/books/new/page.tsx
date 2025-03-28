"use client";

import BookForm from "@/components/admin/forms/BookForm";

const NewBookPage = () => {
    return (


        <div className="w-full p-4">

            <section className="w-full bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 md:p-7 shadow-sm">

                <BookForm />
            </section>
        </div>

    );
};

export default NewBookPage;