export const navigationLinks = [
    {
        href: "/library",
        label: "Library",
    },

    {
        img: "/icons/user.svg",
        selectedImg: "/icons/user-fill.svg",
        href: "/my-profile",
        label: "My Profile",
    },
];
type DashboardStats = {
    totalUsers: number;
    totalBooks: number;
    totalAuthors: number;
  };
export const INITIAL_STATS: DashboardStats = {
    totalUsers: 0,
    totalBooks: 0,
    totalAuthors: 0,
  };

export const adminSideBarLinks = [
    {
        img: "/icons/admin/home.svg",
        route: "/admin",
        text: "Home",
    },
    {
        img: "/icons/admin/users.svg",
        route: "/admin/users",
        text: "Usuarios",
    },
    {
        img: "/icons/admin/book.svg",
        route: "/admin/books",
        text: "Libros",
    },
    {
        img: "/icons/admin/bookmark.svg",
        route: "/admin/authors",
        text: "Autores",
    },
];

export const FIELD_NAMES = {
    fullName: "Full name",
    email: "Email",
    universityId: "University ID Number",
    password: "Password",
    universityCard: "Upload University ID Card",
};

export const FIELD_TYPES = {
    fullName: "text",
    email: "email",
    universityId: "number",
    password: "password",
};

export const authorsInfo = [
    {
        cedula: "10023455664",
        nombreCompleto: "Gabriel Garcia Marquez",
        nacionalidad: "Colombiano"
    },
    {
        cedula: "10023455665",
        nombreCompleto: "Antonio Garcia Marquez",
        nacionalidad: "Colombiano"
    },
    {
        cedula: "10023455666",
        nombreCompleto: "Marcelo Garcia Marquez",
        nacionalidad: "Colombiano"
    }
];
export const sampleBooks = [
    {
        isbn: "1",
        editorial: "The Midnight Library",
        genero: "Ficción",
        anoPublicacion: 2020,
        autorCedula: "10023455666", // Matt Haig
        cover: "https://m.media-amazon.com/images/I/81J6APjwxlL.jpg",
        video: "/sample-video.mp4?updatedAt=1722593504152",
    },
    {
        isbn: "2",
        editorial: "Atomic Habits",
        genero: "Autoayuda",
        anoPublicacion: 2018,
        autorCedula: "10023455665", // James Clear
        cover: "https://m.media-amazon.com/images/I/81F90H7hnML.jpg",
        video: "/sample-video.mp4?updatedAt=1722593504152",
    },
    {
        isbn: "3",
        editorial: "Cien años de soledad",
        genero: "Realismo mágico",
        anoPublicacion: 1967,
        autorCedula: "10023455664", // Gabriel García Márquez
        cover: "https://m.media-amazon.com/images/I/81F90H7hnML.jpg",
        video: "/sample-video.mp4?updatedAt=1722593504152",
    },
    {
        isbn: "4",
        editorial: "El amor en los tiempos del cólera",
        genero: "Novela romántica",
        anoPublicacion: 1985,
        autorCedula: "10023455664", // Gabriel García Márquez
        cover: "https://m.media-amazon.com/images/I/81J6APjwxlL.jpg",
        video: "/sample-video.mp4?updatedAt=1722593504152",
    },
];