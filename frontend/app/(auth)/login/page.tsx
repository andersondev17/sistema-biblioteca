"use client";

import AuthForm from "@/components/AuthForm";
import { LoginFormValues, loginSchema } from "@/lib/validations";
import AuthService from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      
      const user = await AuthService.login(data);
      toast.success("Inicio de sesión exitoso");
     router.push("/");
      return { success: true };
      
    } catch (error: any) {
      const errorMessage = error.message || "Credenciales inválidas";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-500/20 border border-red-400">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <AuthForm
        type="LOGIN"
        schema={loginSchema}
        defaultValues={{
          userName: "",
          password: "",
        }}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default page;