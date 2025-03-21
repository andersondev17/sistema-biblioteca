"use client";

import AuthForm from "@/components/AuthForm";
import { RegisterFormValues, registerSchema } from "@/lib/validations";
import { useState } from "react";

const page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      // Solo los administradores pueden crear usuarios, así que esta página
      // normalmente solo sería accesible por ellos
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        return { 
          success: false, 
          error: result.message || "Error al crear usuario" 
        };
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: "Error al conectar con el servidor" 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      type="REGISTER"
      schema={registerSchema}
      defaultValues={{
        userName: "",
        password: "",
        tipo: "EMPLEADO", // Valor por defecto
      }}
      onSubmit={onSubmit}
    />
  );
};

export default page;