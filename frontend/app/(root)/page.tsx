'use client'

import BookList from "@/components/BookList";
import BookOverview from "@/components/book/BookOverview";
import { Skeleton } from "@/components/ui/skeleton";
import AuthService from "@/services/auth.service";
import AuthorService from "@/services/author.service";
import BookService from "@/services/book.service";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Home = () => {
  const router = useRouter();
  const [books, setBooks] = useState<LibroView[]>([]);
  const [authors, setAuthors] = useState<Autor[]>([]);
  const [selectedISBN, setSelectedISBN] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Efecto principal
  useEffect(() => {
    // Verificar autenticación
    if (!AuthService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Cargar datos
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Cargar libros y autores en paralelo
        const [booksData, authorsData] = await Promise.all([
          BookService.getAllBooks(),
          AuthorService.getAllAuthors()
        ]);
        
        // Añadir covers a los libros
        const booksWithCovers = booksData.map(book=> ({
          ...book,
          cover: `https://picsum.photos/seed/${book.isbn}/400/600`
        }));
        
        setBooks(booksWithCovers);
        setAuthors(authorsData);
        
        // Seleccionar primer libro
        if (booksWithCovers.length > 0 && !selectedISBN) {
          setSelectedISBN(booksWithCovers[0].isbn);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("No se pudieron cargar los datos. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router, selectedISBN]);

  // Seleccionar un libro
  const handleSelectBook = (isbn: string) => {
    setSelectedISBN(isbn);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Obtener libro y autor seleccionados
  const selectedBook = books.find(b => b.isbn === selectedISBN);
  const selectedAuthor = selectedBook 
    ? authors.find(a => a.cedula === selectedBook.autorCedula) 
    : undefined;
  
  // Libros relacionados (mismo autor)
  const relatedBooks = selectedBook
    ? books.filter(b => b.autorCedula === selectedBook.autorCedula)
    : [];

  // Esqueleto durante carga
  if (loading && books.length === 0) {
    return (
      <div>
        <section className="book-overview">
          <div className="flex flex-1 flex-col gap-5">
            <Skeleton className="h-16 w-3/4 bg-dark-400" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 bg-dark-400" />
              <Skeleton className="h-6 w-32 bg-dark-400" />
            </div>
            <Skeleton className="h-12 w-40 bg-dark-400" />
          </div>
          <div className="flex flex-1 justify-center">
            <Skeleton className="aspect-[2/3] w-64 rounded-lg bg-dark-400" />
          </div>
        </section>
        
        <BookList
          title="Catálogo de Libros"
          books={[]}
          authors={[]}
          containerClassname="mt-28"
          loading={true}
        />
      </div>
    );
  }

  // No hay libros
  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl text-light-200">No hay libros disponibles</h2>
        <p className="text-light-100 mt-2">El catálogo está vacío actualmente.</p>
      </div>
    );
  }

  return (
    <div>
      <BookOverview 
        isbn={selectedISBN}
        libro={selectedBook}
        autor={selectedAuthor}
        relatedBooks={relatedBooks}
      />
      
      <BookList 
        title="Catálogo de Libros"
        books={books}
        authors={authors}
        containerClassname="mt-28"
        onBookSelect={handleSelectBook}
        selectedBookISBN={selectedISBN}
      />
    </div>
  );
};

export default Home;