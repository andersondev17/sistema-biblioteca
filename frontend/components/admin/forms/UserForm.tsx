"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userSchema } from "@/lib/validations";
import UserService from "@/services/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type UserFormValues = {
    userName: string;
    password?: string;
    tipo: "ADMINISTRADOR" | "EMPLEADO";
};

type UserFormProps = {
    initialData?: Usuario | null;
};

const UserForm = ({ initialData = null }: UserFormProps) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = !!initialData;

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: initialData ? {
            userName: initialData.userName,
            password: "", // No incluir contraseña en edición
            tipo: initialData.tipo as "ADMINISTRADOR" | "EMPLEADO",
        } : {
            userName: "",
            password: "",
            tipo: "EMPLEADO",
        }
    });

    const onSubmit = async (data: UserFormValues) => {
        try {
            setIsSubmitting(true);

            if (isEditing && initialData) {
                // Solo enviamos la contraseña si no está vacía
                const userData = data.password
                    ? data
                    : { userName: data.userName, tipo: data.tipo };

                await UserService.updateUser(initialData.id, userData);
                toast.success("Usuario actualizado exitosamente");
            } else {
                await UserService.createUser(data);
                toast.success("Usuario creado exitosamente");
            }

            router.push("/admin/users");
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Error al guardar el usuario";
            toast.error(errorMessage);
            console.error("Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Link href="/admin/users" className="text-slate-500 hover:text-primary-admin">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold text-dark-100">
                    {isEditing ? "Editar Usuario" : "Crear Usuario"}
                </h1>
            </div>

            <Card className="border-white">
                <CardHeader>
                    <CardTitle className="text-xl text-dark-200">
                        {isEditing ? "Información del usuario" : "Nuevo usuario"}
                    </CardTitle>
                    <CardDescription>
                        {isEditing
                            ? "Actualice la información del usuario. Deje la contraseña en blanco para mantenerla sin cambios."
                            : "Complete la información para crear un nuevo usuario."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <FormField
                                    control={form.control}
                                    name="userName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-dark-200">Nombre de usuario</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="border-light-400/50 focus:border-primary-admin"
                                                    placeholder="usuario123"
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-dark-200">
                                                {isEditing ? "Nueva contraseña (opcional)" : "Contraseña"}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    className="border-light-400/50 focus:border-primary-admin"
                                                    placeholder={isEditing ? "••••••••" : "Contraseña"}
                                                    disabled={isSubmitting}
                                                    required={!isEditing}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tipo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-dark-200">Tipo de usuario</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isSubmitting}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="border-light-400/50 focus:border-primary-admin">
                                                        <SelectValue placeholder="Seleccione el tipo de usuario" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                                                    <SelectItem value="EMPLEADO">Empleado</SelectItem>
                                                </SelectContent>
                                            </Select>
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
                                            {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
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

export default UserForm;