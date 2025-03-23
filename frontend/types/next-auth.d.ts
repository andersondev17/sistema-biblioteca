import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    tipo: "ADMINISTRADOR" | "EMPLEADO";
    token: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      tipo: "ADMINISTRADOR" | "EMPLEADO";
    };
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    tipo: "ADMINISTRADOR" | "EMPLEADO";
    accessToken: string;
  }
}