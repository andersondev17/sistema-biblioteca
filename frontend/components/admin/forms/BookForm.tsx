// components/admin/forms/BookForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBookForm } from "@/hooks/useBookForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo } from "react";

interface BookFormProps {
    initialData?: Libro | null;
}

const BookForm = ({ initialData = null }: BookFormProps) => {
    const router = useRouter();

    const {
        form,
        authors,
        genres,
        isSubmitting,
        isLoadingAuthors,
        isEditing,
        currentYear,
        onSubmit
    } = useBookForm(initialData);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="rounded-full"
                >
                    <Link href="/admin/books">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Volver</span>
                    </Link>
                </Button>
                <h1 className="text-xl font-semibold">
                    {isEditing ? 'Editar Libro' : 'Crear nuevo Libro'}
                </h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="isbn"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-dark-400">ISBN</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="book-form_input"
                                            placeholder="Ej. 9780307476463"
                                            disabled={isSubmitting || isEditing}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="editorial"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-dark-400">Editorial</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="book-form_input"
                                            placeholder="Ej. Planeta"
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="genero"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-dark-400">Género</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isSubmitting}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="book-form_input">
                                                <SelectValue placeholder="Seleccione un género" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white">
                                            {genres.map((genre) => (
                                                <SelectItem key={genre} value={genre}>
                                                    {genre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="anoPublicacion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-dark-400">Año de publicación</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            className="book-form_input"
                                            placeholder="Ej. 2021"
                                            min={1000}
                                            max={currentYear}
                                            disabled={isSubmitting}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="autorCedula"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-dark-400">Autor</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isSubmitting || isLoadingAuthors}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="book-form_input">
                                                <SelectValue placeholder={isLoadingAuthors ? "Cargando autores..." : "Seleccione un autor"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white">
                                            {authors.map((author) => (
                                                <SelectItem key={author.cedula} value={author.cedula}>
                                                    {author.nombreCompleto} ({author.cedula})
                                                </SelectItem>
                                            ))}
                                            {authors.length === 0 && !isLoadingAuthors && (
                                                <SelectItem value="" disabled>
                                                    No hay autores disponibles
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                            className="border-gray-300 text-dark-400 hover:border-gray-400 hover:text-dark-500"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-primary-admin text-white shadow-xs hover:bg-primary-admin/60"
                            disabled={isSubmitting || isLoadingAuthors}
                        >
                            {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar Libro' : 'Crear Libro'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default memo(BookForm);