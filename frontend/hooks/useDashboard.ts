// hooks/useDashboard.ts
import { useLoading } from "@/contexts/LoadingContext";
import { GET_DASHBOARD_DATA } from "@/graphql/queries/dashboard.query";
import AuthService from "@/services/auth.service";
import graphqlClient from "@/services/graphql.service";
import { useEffect, useRef, useState } from "react";

type DashboardStats = {
  totalUsers: number;
  totalBooks: number;
  totalAuthors: number;
  borrowedBooks: number;
};

const INITIAL_STATS: DashboardStats = {
  totalUsers: 0,
  totalBooks: 0,
  totalAuthors: 0,
  borrowedBooks: 145
};

type Book = {
  isbn: string;
  cover: string;
  editorial: string;
  author: string;
  genero: string;
  date: string;
};

const FALLBACK_BOOKS: Book[] = Array.from({ length: 3 }, (_, i) => ({
  isbn: `${i + 1}`,
  cover: `https://picsum.photos/seed/${i + 1}/300/400`,
  editorial: ['Inside Evil', 'People in Glass Houses', 'The Great Reclamation'][i],
  author: 'Rachel Heng',
  genero: 'Strategic Fantasy',
  date: '12/01/24'
}));

const getGreeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';
};
export const useDashboardData = () => {
  const [state, setState] = useState({
    stats: INITIAL_STATS,
    recentBooks: FALLBACK_BOOKS,
    loading: true,
    error: null as Error | null
  });

  const { setLoading: setGlobalLoading } = useLoading();
  const isMountedRef = useRef(true); // Para controlar el estado del componente
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {

        setGlobalLoading(true);
        setState(prev => ({ ...prev, loading: true }));

        const { data } = await graphqlClient.query({
          query: GET_DASHBOARD_DATA,
          fetchPolicy: 'network-only',

        });

        if (!isMountedRef.current) return;

        const bookList = (data.recentBooks || []).map((book: any) => ({
          isbn: book.isbn,
          cover: `https://picsum.photos/seed/${book.isbn}/300/400`,
          editorial: book.editorial,
          author: book.autor?.nombreCompleto || 'Autor desconocido',
          genero: book.genero,
          date: new Date().toLocaleDateString()
        }));

        setState({
          stats: {
            totalUsers: data.totalUsers ?? 0,
            totalBooks: data.totalBooks ?? 0,
            totalAuthors: data.totalAuthors ?? 0,
            borrowedBooks: INITIAL_STATS.borrowedBooks
          },
          recentBooks: bookList.length > 0 ? bookList : FALLBACK_BOOKS,
          loading: false,
          error: null
        });

      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;

        const error = err instanceof Error
          ? err
          : new Error('Error desconocido al obtener datos del dashboard');

        console.error("Error fetching dashboard data:", error);
        setState({
          stats: { ...INITIAL_STATS, totalUsers: 317, totalBooks: 163 },
          recentBooks: FALLBACK_BOOKS,
          loading: false,
          error
        });
      } finally {
        if (isMountedRef.current) {
          setGlobalLoading(false);
        }
      }
    };

    fetchData();

  }, [setGlobalLoading]);

  return {
    ...state,
    user,
    greeting: getGreeting(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};