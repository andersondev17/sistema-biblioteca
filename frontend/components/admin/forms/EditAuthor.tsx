"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { autorSchema } from "@/lib/validations";
import AuthorService from "@/services/author.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type AuthorFormValues = {
    cedula: string;
    nombreCompleto: string;
    nacionalidad: string;
};

type AuthorFormProps = {
    initialData?: Autor | null;
};

const AuthorForm = ({ initialData = null }: AuthorFormProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = !!initialData;

    const form = useForm<AuthorFormValues>({
        resolver: zodResolver(autorSchema),
        defaultValues: initialData ? {
            cedula: initialData.cedula,
            nombreCompleto: initialData.nombreCompleto,
            nacionalidad: initialData.nacionalidad,
        } : {
            cedula: "",
            nombreCompleto: "",
            nacionalidad: "",
        }
    });

    const onSubmit = async (data: AuthorFormValues) => {
        try {
            setIsSubmitting(true);

            if (isEditing && initialData) {
                // No enviamos la cédula en la actualización, ya que es el identificador en la URL
                const authorData = {
                    nombreCompleto: data.nombreCompleto,
                    nacionalidad: data.nacionalidad
                };

                await AuthorService.updateAuthor(initialData.cedula, authorData);
                toast.success("Autor actualizado exitosamente");
            } else {
                await AuthorService.createAuthor(data);
                toast.success("Autor creado exitosamente");
            }

            router.push("/admin/authors");
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Error al guardar el autor";
            toast.error(errorMessage);
            console.error("Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Link href="/admin/authors" className="text-slate-500 hover:text-primary-admin">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold text-dark-100">
                    {isEditing ? "Editar Autor" : "Crear Autor"}
                </h1>
            </div>

            <Card className="border-light-400/50">
                <CardHeader>
                    <CardTitle className="text-xl text-dark-200">
                        {isEditing ? "Información del autor" : "Nuevo autor"}
                    </CardTitle>
                    <CardDescription>
                        {isEditing
                            ? "Actualice la información del autor."
                            : "Complete la información para crear un nuevo autor."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <FormField
                                    control={form.control}
                                    name="cedula"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-dark-200">Cédula</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="border-light-400/50 focus:border-primary-admin"
                                                    placeholder="123456789"
                                                    disabled={isSubmitting || isEditing} // La cédula no se puede editar
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="nombreCompleto"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-dark-200">Nombre completo</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="border-light-400/50 focus:border-primary-admin"
                                                    placeholder="Gabriel García Márquez"
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="nacionalidad"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-dark-200">Nacionalidad</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="border-light-400/50 focus:border-primary-admin"
                                                    placeholder="Colombiano"
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={isSubmitting}
                                    className="border-light-400/50 text-dark-400 hover:bg-slate-50"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={isEditing
                                        ? "bg-amber-500 text-white hover:bg-amber-600"
                                        : "bg-primary-admin text-white hover:bg-primary-admin/90"
                                    }
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            {isEditing ? 'Actualizar Autor' : 'Crear Autor'}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthorForm;