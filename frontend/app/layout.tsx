import ApolloWrapper from "@/components/ApolloWrapper";
import { LoadingProvider } from "@/contexts/LoadingContext";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

// Configuración de IBM Plex Sans
const ibmPlexSans = localFont({
  src: [
    { path: "./fonts/IBMPlexSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/IBMPlexSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/IBMPlexSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/IBMPlexSans-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-ibm-plex-sans",
});

// Configuración de Bebas Neue
const bebasNeue = localFont({
  src: [
    { path: "./fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--bebas-neue",
});

export const metadata: Metadata = {
  title: "Sistema de biblioteca",
  description: "Solución de biblioteca para mantener una colección sobre los libros que los estudiantes han ido leyendo y sus autores.",
  icons: {
    icon: "/icons/logo.svg",
  }
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="es">
      <body className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}>
      <ApolloWrapper>{/* para proveer el cliente de Apollo, */}

        <LoadingProvider>
          {children}
          <Toaster />
        </LoadingProvider>

        </ApolloWrapper>
      </body>
    </html>
  );
}

export default RootLayout;