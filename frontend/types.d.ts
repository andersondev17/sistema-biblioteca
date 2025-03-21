// Tipos basados en el esquema de Prisma
interface Usuario {
    id: number;
    userName: string;
    password: string;
    tipo: 'ADMINISTRADOR' | 'EMPLEADO';
    createdAt: Date;
    updatedAt: Date;
}

interface Autor {
    cedula: string;
    nombreCompleto: string;
    nacionalidad: string;
    createdAt?: Date;
    updatedAt?: Date;
    libros?: Libro[];
}

interface Libro {
    isbn: string;
    editorial: string;
    genero: string;
    anoPublicacion: number;
    autorCedula: string;
    createdAt?: Date;
    updatedAt?: Date;
    autor?: Autor;
    cover?: string;
}


// Tipo para la vista combinada (usado en BookOverview)
interface LibroConAutor extends Libro, Omit<Autor, 'libros' | 'createdAt' | 'updatedAt'> {
    cover?: string;
    video?: string;
}

// Tipo para la lista de libros (sin datos del autor)
type LibroView = Libro & {
    cover?: string;
    video?: string;
}

// Original Book type (mantener para compatibilidad)
interface Book {
    isbn: string;
    editorial: string;
    genero: string;
    anoPublicacion: number;
    autorCedula: string;
    video?: string;
    cover?: string;
    // Propiedades del autor
    cedula?: string;
    nombreCompleto?: string;
    nacionalidad: string;
}

declare global {
    interface Window {
    }
}