// hooks/useBookForm.ts
import { useAuthors } from "@/hooks/useAuthors";
import { BookFormValues, libroSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function useBookForm(initialData?: Libro | null) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = !!initialData;

    const { authors, loading: isLoadingAuthors } = useAuthors();

    const form = useForm<BookFormValues>({
        resolver: zodResolver(libroSchema),
        defaultValues: initialData || {
            isbn: "",
            editorial: "",
            genero: "",
            anoPublicacion: new Date().getFullYear(),
            autorCedula: "",
            cover: ""
        }
    });

    const onSubmit = async (data: BookFormValues) => {
        try {
            setIsSubmitting(true);

            const bookData = {
                ...data,
                anoPublicacion: Number(data.anoPublicacion)
            };
            const BookService = await import("@/services/book.service").then(m => m.default);

            if (isEditing && initialData) {
                await BookService.updateBook(initialData.isbn, bookData);
                toast.success("Libro actualizado exitosamente");
            } else {
                await BookService.createBook(bookData);
                toast.success("Libro creado exitosamente");
            }

            router.push("/admin/books");
            router.refresh();
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Error al guardar el libro";
            toast.error(errorMessage);
            console.error("Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const genres = [
        "Ficción", "No ficción", "Ciencia Ficción", "Fantasía",
        "Biografía", "Historia", "Misterio", "Aventura",
        "Romance", "Terror", "Poesía", "Drama",
        "Realismo mágico", "Ensayo", "Autoayuda"
    ];

    return {
        form,
        authors,
        genres,
        isSubmitting,
        isLoadingAuthors,
        isEditing,
        currentYear: new Date().getFullYear(),
        onSubmit
    };
}