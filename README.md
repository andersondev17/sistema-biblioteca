# Biblioteca Municipal API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![Prisma](https://img.shields.io/badge/Prisma-6.x-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![JWT](https://img.shields.io/badge/JWT-Auth-critical)
![React](https://img.shields.io/badge/React-19.x-%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-%233178C6)
![Next.js](https://img.shields.io/badge/Next.js-15.x-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-%2338B2AC)

Sistema para gestión de bibliotecas con seguimiento de relaciones entre libros, autores y usuarios. Combina API REST tradicional con endpoints GraphQL para casos específicos de alto rendimiento.

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
# 📚La aplicación sigue una arquitectura de capas claramente definida:


```mermaid

flowchart TB
 subgraph subGraph0["Frontend (Next.js)"]
        UI["Interfaz de Usuario"]
        Comps["Componentes React"]
        Pages["Páginas"]
        Services["Servicios API"]
  end
 subgraph subGraph1["API (Node/Express)"]
        Routes["Rutas API"]
        Controllers["Controladores"]
        Middleware["Middlewares"]
  end
 subgraph Persistencia["Persistencia"]
        Prisma["Prisma ORM"]
        DB[("Base de Datos MySQL")]
  end
 subgraph Middleware["Middleware"]
        Auth["Autenticación"]
        RBAC["Control de Acceso"]
        ErrorHandling["Manejo de Errores"]
        Rate["Rate Limiting"]
  end
 subgraph Controladores["Controladores"]
        AuthCtrl["Auth Controller"]
        UserCtrl["User Controller"]
        AuthorCtrl["Author Controller"]
        BookCtrl["Book Controller"]
        ReportCtrl["Report Controller"]
  end
    UI --> Comps
    Comps --> Pages
    Pages --> Services
    Services -- HTTP Requests --> Routes
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> Prisma
    Prisma --> DB
    Middleware --- Auth & RBAC & ErrorHandling & Rate
    Controllers --- AuthCtrl & UserCtrl & AuthorCtrl & BookCtrl & ReportCtrl

     UI:::frontend
     Comps:::frontend
     Pages:::frontend
     Services:::frontend
     Routes:::api
     Controllers:::api
     Middleware:::api
     Prisma:::database
     DB:::database
     Auth:::middlewares
     RBAC:::middlewares
     ErrorHandling:::middlewares
     Rate:::middlewares
     AuthCtrl:::controllers
     UserCtrl:::controllers
     AuthorCtrl:::controllers
     BookCtrl:::controllers
     ReportCtrl:::controllers
    classDef frontend fill:#D6E4FF,stroke:#7B93DB,stroke-width:2px
    classDef api fill:#D1F7C4,stroke:#82B366,stroke-width:2px
    classDef database fill:#FFE6CC,stroke:#D79B00,stroke-width:2px
    classDef middlewares fill:#BAC8FF,stroke:#3D56B2,stroke-width:1px
    classDef controllers fill:#C5E8B7,stroke:#59A041,stroke-width:1px
```


## Características

### Backend 
- Autenticación basada en JWT
- Gestión de roles (administrador y empleado)
- CRUD completo para autores, libros y usuarios
- Generación de reportes
- Documentación completa de endpoints : [Aqui](https://docs.google.com/document/d/1I-r1KHZBm6ZxHvHGeeV8F5-v5n1i-smFPe9R8aJvb4s/edit?tab=t.0)

## Tecnologías

- Node.js & Express
- Prisma ORM
- MySQL
- JWT

## Instalación

1. Clonar el repositorio
 ```bash
   git clone https://github.com/tuusuario/biblioteca-municipal-api.git
   cd backend
```
2. Instalar dependencias
```bash
 npm install
```
3. Configurar variables de entorno
```bash

DATABASE_URL="mysql://usuario@localhost:puerto/base_de_datos"

#environment
NODE_ENV="development"

# JWT Variables
JWT_SECRET="secret"
JWT_EXPIRES_IN="1d"

# Server
PORT=

```

4. Ejecutar migraciones de la base de datos
```bash
  npx prisma migrate dev
  npx prisma studio

```
5. Iniciar el servidor
```bash
   npm run dev
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

# Autenticación de Usuarios (8 puntos)

Sistema de autenticación basado en JWT
Almacenamiento seguro de tokens en localStorage
Manejo de roles mediante middlewares


