"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthorFormValues, autorSchema } from "@/lib/validations";
import AuthorService from "@/services/author.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type AuthorFormProps = {
    initialData?: Autor | null;
};

const AuthorForm = ({ initialData = null }: AuthorFormProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = !!initialData;

    const form = useForm<AuthorFormValues>({
        resolver: zodResolver(autorSchema),
        defaultValues: initialData || {
            cedula: "",
            nombreCompleto: "",
            nacionalidad: ""
        }
    });

    const onSubmit = async (data: AuthorFormValues) => {
        try {
            setIsSubmitting(true);
            
            if (isEditing && initialData) {
                await AuthorService.updateAuthor(initialData.cedula, data);
                toast.success("Autor actualizado exitosamente");
            } else {
                await AuthorService.createAuthor(data);
                toast.success("Autor creado exitosamente");
            }
            
            router.push("/admin/books");
            router.refresh();
            
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Error al guardar el autor";
            toast.error(errorMessage);
            console.error("Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="cedula"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-dark-400">Cédula</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="book-form_input"
                                        placeholder="Ej. 10023455664"
                                        disabled={isSubmitting || isEditing}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="nombreCompleto"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-dark-400">Nombre Completo</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="book-form_input"
                                        placeholder="Ej. Gabriel García Márquez"
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="nacionalidad"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-dark-400">Nacionalidad</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="book-form_input"
                                        placeholder="Ej. Colombiano"
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
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
                        className="border-gray-300 text-dark-400"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="bg-primary text-dark-100 hover:bg-primary/90"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar Autor' : 'Crear Autor'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default AuthorForm;