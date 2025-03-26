// hooks/useDashboardData.ts
import AuthService from "@/services/auth.service";
import AuthorService from "@/services/author.service";
import BookService from "@/services/book.service";
import UserService from "@/services/user.service";
import { useEffect, useState } from "react";

type DashboardStats = { [K in keyof typeof initialStats]: number };
type RecentBook = Pick<LibroView, 'isbn' | 'cover' | 'editorial' | 'genero' | 'createdAt'> & { author: string };

const initialStats = { totalUsers: 0, totalBooks: 0, totalAuthors: 0, borrowedBooks: 145 };
const fallbackBooks = Array.from({ length: 3 }, (_, i) => ({
    isbn: `${i + 1}`, cover: `https://picsum.photos/seed/${i + 1}/300/400`,
    editorial: ['Inside Evil', 'People in Glass Houses', 'The Great Reclamation'][i],
    author: 'Rachel Heng', genero: 'Strategic Fantasy', date: '12/01/24'
}));

const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';
};

export const useDashboardData = () => {
    const [data, setData] = useState({ stats: initialStats, recentBooks: fallbackBooks });
    const [loading, setLoading] = useState(true);
    const user = AuthService.getCurrentUser();

    useEffect(() => {
        (async () => {
            try {
                const [users, books, authors] = await Promise.all([
                    UserService.getAllUsers().catch(() => []),
                    BookService.getAllBooks().catch(() => []),
                    AuthorService.getAllAuthors().catch(() => [])
                ]);

                const authorsMap = Object.fromEntries((authors as Autor[]).map(a => [a.cedula, a.nombreCompleto]));
                const recentBooks = (books as LibroView[]).slice(0, 5).map(book => ({
                    isbn: book.isbn,
                    cover: book.cover || `https://picsum.photos/seed/${book.isbn}/300/400`,
                    editorial: book.editorial,
                    author: authorsMap[book.autorCedula] || 'Autor desconocido',
                    genero: book.genero,
                    date: new Date(book.createdAt || Date.now()).toLocaleDateString()
                }));

                setData({
                    stats: {
                        totalUsers: users.length,
                        totalBooks: books.length,
                        totalAuthors: authors.length,
                        borrowedBooks: initialStats.borrowedBooks
                    },
                    recentBooks: recentBooks.length ? recentBooks : fallbackBooks
                });

            } catch (error) {
                console.error("Error loading dashboard:", error);
                setData({ stats: { ...initialStats, totalUsers: 317, totalBooks: 163 }, recentBooks: fallbackBooks });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return {
        user,
        loading,
        greeting: getGreeting(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...data
    };
};