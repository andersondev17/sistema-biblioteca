# Biblioteca Municipal API

API RESTful para la gestión de una biblioteca municipal, permitiendo administrar autores, libros y usuarios.

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
