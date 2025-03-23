'use client'

import Image from "next/image"
import { useMemo } from "react"
import AuthorDrawer from "./AuthorDrawer"
import { Drawer, DrawerTrigger } from "./ui/drawer"
import { Skeleton } from "./ui/skeleton"

type BookListProps = {
  title: string;
  books: LibroView[];
  authors: Autor[];
  containerClassname?: string;
  onBookSelect?: (isbn: string) => void;
  selectedBookISBN?: string;
  loading?: boolean;
  isAuthenticated?: boolean;
}

const BookList = ({   title,   books = [],   authors = [],   containerClassname,  onBookSelect,   selectedBookISBN,  loading = false,  isAuthenticated = false}: BookListProps) => {
  const authorMap = useMemo(() => 
    new Map(authors.map(author => [author.cedula, author])), 
    [authors]
  );

  if (loading) {
    return (
      <div className={containerClassname}>
        <h2 className="text-2xl font-bold text-light-200 mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-dark-300 rounded-lg p-4">
              <Skeleton className="aspect-[2/3] w-full mb-3 bg-dark-400" />
              <Skeleton className="h-6 w-3/4 mb-2 bg-dark-400" />
              <Skeleton className="h-4 w-1/2 bg-dark-400" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassname}>
      <h2 className="text-2xl font-bold text-light-200 mb-6">{title}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.isbn}
            className={`text-left rounded-lg ${book.isbn === selectedBookISBN ? 'bg-dark-600 ring-2 ring-primary' : 'bg-dark-300 hover:bg-dark-600'} p-4 transition-all group cursor-pointer`}
            onClick={() => onBookSelect?.(book.isbn)}
          >
            {book.cover && (
              <div className="mb-3 aspect-[2/3] overflow-hidden rounded-md">
                <Image 
                  src={book.cover} 
                  alt={book.editorial} 
                  width={180}
                  height={270}
                  className="h-full w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <h4 className="book-title transition-colors duration-300 group-hover:text-primary">{book.editorial}</h4>
            <p className="book-genre">{book.genero}</p>
            
            {authorMap.has(book.autorCedula) && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-sm text-light-500">Por:</span>
                <Drawer>
                  <DrawerTrigger asChild>
                    <button 
                      className="text-sm text-light-200 hover:underline hover:text-primary transition-colors duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {authorMap.get(book.autorCedula)?.nombreCompleto}
                    </button>
                  </DrawerTrigger>
                  <AuthorDrawer 
                    autor={authorMap.get(book.autorCedula)!} 
                    libros={books.filter(b => b.autorCedula === book.autorCedula)}
                    isAdmin={isAuthenticated}
                  />
                </Drawer>
              </div>
            )}
            
            <div className="mt-2 flex items-center gap-2">
              <Image src="/icons/star.svg" alt="año" width={16} height={16} />
              <span className="text-sm text-light-100">{book.anoPublicacion}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;