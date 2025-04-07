// lib/book-covers.ts - Nuevo archivo para centralizar la lógica de portadas
export const getBookCover = (isbn: string, title: string = '') => {
    // Array de servicios de portadas con fallbacks
    const services = [
        // OpenLibrary (primera opción)
        `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
        // Google Books (segunda opción)
        `https://books.google.com/books/content?id=${isbn}&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
        // Imagen de respaldo basada en título
        `https://via.placeholder.com/300x450/333/fff?text=${encodeURIComponent(title || isbn)}`
    ];

    // Retornamos el primer servicio (implementaremos lógica avanzada de fallback en componentes)
    return services[0];
};

// Función auxiliar para verificar si una imagen existe
export const imageExists = async (url: string): Promise<boolean> => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
};