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

export const adminSideBarLinks = [
    {
        img: "/icons/admin/home.svg",
        route: "/admin",
        text: "Home",
    },
    {
        img: "/icons/admin/users.svg",
        route: "/admin/users",
        text: "All Users",
    },
    {
        img: "/icons/admin/book.svg",
        route: "/admin/books",
        text: "All Books",
    },
    {
        img: "/icons/admin/bookmark.svg",
        route: "/admin/book-requests",
        text: "Borrow Requests",
    },
    {
        img: "/icons/admin/user.svg",
        route: "/admin/account-requests",
        text: "Account Requests",
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
        genero: "Matt Haig",
        anoPublicacion: 2002,
        autorCedula: "71734783",
        cover: "https://m.media-amazon.com/images/I/81J6APjwxlL.jpg",
        video: "/sample-video.mp4?updatedAt=1722593504152",
    },
    {
        isbn: "2",
        editorial: "Atomic Habits",
        genero: "James Lopez",
        anoPublicacion: 1999,
        autorCedula: "4.9",
        cover: "https://m.media-amazon.com/images/I/81F90H7hnML.jpg",
        video: "/sample-video.mp4?updatedAt=1722593504152",
    },
    {
        isbn: "3",
        editorial: "Atomic Habits",
        genero: "James Clear",
        anoPublicacion: 1999,
        autorCedula: "411113349",
        cover: "https://m.media-amazon.com/images/I/81F90H7hnML.jpg",
        video: "/sample-video.mp4?updatedAt=1722593504152",
    },
    {
        isbn: "4",
        editorial: "The Midnight Library",
        genero: "Matt Haig",
        anoPublicacion: 2002,
        autorCedula: "71734783",
        cover: "https://m.media-amazon.com/images/I/81J6APjwxlL.jpg",
        video: "/sample-video.mp4?updatedAt=1722593504152",
    },
];