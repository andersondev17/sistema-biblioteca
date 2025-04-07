# Biblioteca Municipal API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![Prisma ORM](https://img.shields.io/badge/Prisma-6.x-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![JWT](https://img.shields.io/badge/JWT-Auth-critical)
![React](https://img.shields.io/badge/React-19.x-%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-%233178C6)
![Next.js](https://img.shields.io/badge/Next.js-15.x-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-%2338B2AC)

Sistema para gestión de bibliotecas con seguimiento de relaciones entre libros, autores y usuarios. Combina API REST tradicional con endpoints GraphQL para casos específicos de alto rendimiento.Con algunas practicas como rate-limiting, DDoS protection y Protección de rutas.

# 📚 Diagrama de Clases


A continuación se muestra el diagrama de clases del sistema:

```mermaid
classDiagram
    direction LR
    
    class Usuario {
        <<Abstract>>
        +id: number
        +userName: string
        +password: string
        +tipo: string
        +login(): boolean
    }
    
    class Administrador {
        +crearAutor(cedula, nombre, nacionalidad)
        +actualizarAutor(cedula, datos)
        +eliminarAutor(cedula)
        +crearLibro(isbn, datos)
        +actualizarLibro(isbn, datos)
        +eliminarLibro(isbn)
        +crearUsuario(datos)
        +actualizarUsuario(id, datos)
        +eliminarUsuario(id)
    }
    
    class Empleado {
        +generarReporteAutor(cedula): ReporteAutor
    }
    
    class Autor {
        +cedula: string
        +nombreCompleto: string
        +nacionalidad: string
    }
    
    class Libro {
        +isbn: string
        +editorial: string
        +genero: string
        +anoPublicacion: number
        +autorCedula: string
    }
    
    Usuario <|-- Administrador
    Usuario <|-- Empleado
    
    Administrador "1" --> "*" Autor : Gestiona CRUD
    Administrador "1" --> "*" Libro : Gestiona CRUD
    Administrador "1" --> "*" Usuario : Gestiona CRUD
    
    Empleado "1" --> "*" Autor : Consulta
    Empleado "1" --> "*" Libro : Consulta
    
    Autor "1" --> "*" Libro : Escribe
    
    note for Usuario "Autenticación con JWT"
    note for Libro "ISBN único"
```

#  Patrones de Diseño Implementados
## - Patrón MVC (Modelo-Vista-Controlador)

El sistema implementa el patrón MVC, separando claramente:

Modelo: Definido mediante esquemas Prisma para las entidades Autor, Libro y Usuario
Vista: Componentes React en el frontend
Controlador: Express Controllers que manejan las peticiones HTTP


## Patron Singleton
#### Para asegurarnos de que la base de datos solo tenga una sola instancia 
```bash 
//database/db.js
const { PrismaClient } = require("@prisma/client");
const { NODE_ENV } = require("../config/env");

class Database {
    constructor() {
        if (!Database.instance) {
            try {
                Database.instance = new PrismaClient();
                console.log(`✅ Conectado a la base de datos en modo ${NODE_ENV}.`);
            } catch (error) {
                console.error("❌ Error al conectar con la base de datos:", error);
                process.exit(1);
            }
        }
    }

    getInstance() {
        return Database.instance;
    }
}

module.exports = new Database().getInstance();
```

# Autenticación de Usuarios 

Sistema de autenticación basado en JWT
Almacenamiento seguro de tokens en localStorage
Manejo de roles mediante middlewares


