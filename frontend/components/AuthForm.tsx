"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DefaultValues, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ZodType } from "zod";

const FIELD_NAMES = {
    userName: "Usuario",
    password: "Contraseña",
    tipo: "Tipo de Usuario"
};

const FIELD_TYPES = {
    userName: "text",
    password: "password"
};

interface AuthFormProps<T extends FieldValues> {
    schema: ZodType<T>;
    defaultValues: DefaultValues<T>;
    onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
    type: "LOGIN" | "REGISTER";
    isLoading?: boolean;
}

const AuthForm = <T extends FieldValues>({ 
    type,
    schema,
    defaultValues,
    onSubmit,
    isLoading: externalLoading
}: AuthFormProps<T>) => {
    const router = useRouter();
    const isLogin = type === "LOGIN";
    const [internalLoading, setInternalLoading] = useState(false);
    
    // Use either external or internal loading state
    const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;

    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    const handleSubmit: SubmitHandler<T> = async (data) => {
        if (!externalLoading) setInternalLoading(true);
        
        try {
            const result = await onSubmit(data);

            if (result.success) {
                toast.success(isLogin ? "Inicio de sesión exitoso" : "Registro exitoso");
                router.push(isLogin ? "/" : "/login");
            } else if (result.error) {
                toast.error(result.error);
            }
        } catch (error: any) {
            console.error("Auth form error:", error);
            toast.error(error?.message || "Error en el servidor");
        } finally {
            if (!externalLoading) setInternalLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-white">
                {isLogin ? "Bienvenido a la biblioteca" : "Crea tu cuenta"}
            </h1>
            <p className="text-light-100">
                {isLogin
                    ? "Accede para gestionar la colección de libros y autores"
                    : "Por favor completa todos los campos para registrarte"}
            </p>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full space-y-6"
                >
                    {Object.keys(defaultValues).map((fieldName) => (
                        <FormField
                            key={fieldName}
                            control={form.control}
                            name={fieldName as any}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="capitalize text-light-100">
                                        {FIELD_NAMES[fieldName as keyof typeof FIELD_NAMES] || fieldName}
                                    </FormLabel>
                                    <FormControl>
                                        {fieldName === "tipo" ? (
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="form-input">
                                                        <SelectValue placeholder="Seleccione tipo de usuario" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                                                    <SelectItem value="EMPLEADO">Empleado</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Input
                                                required
                                                type={FIELD_TYPES[fieldName as keyof typeof FIELD_TYPES] || "text"}
                                                {...field}
                                                className="form-input"
                                                disabled={isLoading}
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                    ))}

                    <Button type="submit" className="form-btn" disabled={isLoading}>
                        {isLoading ? 
                            "Procesando..." : 
                            (isLogin ? "Iniciar Sesión" : "Registrarse")
                        }
                    </Button>
                </form>
            </Form>


         {/*    <p className="text-center text-base font-medium text-light-100">
                {isLogin ? "¿Nuevo por aquí? " : "¿Ya tienes una cuenta? "}
                <Link
                    href={isLogin ? "/register" : "/login"}
                    className="font-bold text-primary"
                >
                    {isLogin ? "Crea una cuenta" : "Iniciar Sesión"}
                </Link>
            </p> */}
        </div>
    );
};

export default AuthForm;