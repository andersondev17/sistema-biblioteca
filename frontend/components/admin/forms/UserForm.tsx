'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserFormValues, userSchema } from "@/lib/validations";
import UserService from "@/services/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface UserFormProps {
    initialData?: { id: number; userName: string; tipo: string } | null;
}

const UserForm = ({ initialData }: UserFormProps = {}) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = !!initialData;

    // Inicialización del formulario con valores por defecto
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: initialData
            ? {
                userName: initialData.userName,
                password: "", // No incluimos la contraseña en modo edición
                tipo: initialData.tipo as "ADMINISTRADOR" | "EMPLEADO"
            }
            : {
                userName: "",
                password: "",
                tipo: "EMPLEADO"
            }
    });

    // Manejador de envío del formulario
    const onSubmit = async (data: UserFormValues) => {
        try {
            setIsSubmitting(true);

            // Preparar datos para enviar
            const userData = {
                userName: data.userName.trim(),
                tipo: data.tipo,
                // Solo incluir contraseña si se ha ingresado una
                ...(data.password && { password: data.password.trim() })
            };

            console.log("Enviando datos:", userData);

            if (isEditing && initialData) {
                await UserService.updateUser(initialData.id, userData);
                toast.success("Usuario actualizado exitosamente");
            } else {
                await UserService.createUser(userData);
                toast.success("Usuario creado exitosamente");
            }

            router.push('/admin/users');
            router.refresh();
        } catch (error: any) {
            console.error('Error al procesar el formulario:', error);
            toast.error(error.message || "Error al procesar la solicitud");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="rounded-full"
                >
                    <Link href="/admin/users">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Volver</span>
                    </Link>
                </Button>
                <h1 className="text-xl font-semibold">
                    {isEditing ? 'Editar usuario' : 'Crear nuevo usuario'}
                </h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre de usuario</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ingrese nombre de usuario"
                                        {...field}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {isEditing
                                        ? 'Contraseña (dejar en blanco para mantener actual)'
                                        : 'Contraseña'}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Ingrese contraseña"
                                        {...field}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tipo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de usuario</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={isSubmitting}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione tipo de usuario" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                                        <SelectItem value="EMPLEADO">Empleado</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary text-dark-100 hover:bg-primary/90"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isEditing ? 'Actualizando...' : 'Creando...'}
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isEditing ? 'Actualizar' : 'Crear'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default UserForm;