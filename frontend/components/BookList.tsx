'use client'

import Image from "next/image";
import { useState } from "react";
import AuthorDrawer from "./AuthorDrawer";
import { Drawer, DrawerTrigger } from "./ui/drawer";

type BookListProps = {
  title: string;
  books: LibroView[]; // Usando el tipo definido
  authorsInfo: Autor[]; // Usando el tipo definido
  containerClassname?: string;
}

const BookList = ({ title, books, authorsInfo, containerClassname }: BookListProps) => {
  // Estado para el autor seleccionado para el drawer
  const [selectedAutor, setSelectedAutor] = useState<Autor | null>(null);

  // Encontrar el autor para un libro específico
  const findAuthorForBook = (autorCedula: string): Autor | undefined => {
    return authorsInfo.find(autor => autor.cedula === autorCedula);
  };

  // Encontrar libros para un autor específico
  const findBooksForAuthor = (cedula: string): LibroView[] => {
    return books.filter(book => book.autorCedula === cedula);
  };

  return (
    <div className={containerClassname}>
      <h2 className="text-2xl font-bold text-light-200 mb-6">{title}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => {
          const bookAuthor = findAuthorForBook(book.autorCedula);
          
          return (
            <div key={book.isbn} className="rounded-lg bg-dark-300 p-4 transition-all hover:bg-dark-600">
              {book.cover && (
                <div className="mb-3 aspect-[2/3] overflow-hidden rounded-md">
                  <Image 
                    src={book.cover} 
                    alt={book.editorial} 
                    width={180}
                    height={270}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <h4 className="book-title">{book.editorial}</h4>
              <p className="book-genre">{book.genero}</p>
              
              {bookAuthor && (
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-sm text-light-500">Por:</span>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <button 
                        className="text-sm text-light-200 hover:underline"
                        onClick={() => setSelectedAutor(bookAuthor)}
                      >
                        {bookAuthor.nombreCompleto}
                      </button>
                    </DrawerTrigger>
                    <AuthorDrawer 
                      autor={bookAuthor} 
                      libros={findBooksForAuthor(bookAuthor.cedula)}
                      isAdmin={false}
                    />
                  </Drawer>
                </div>
              )}
              
              <div className="mt-2 flex items-center gap-2">
                <Image src="/icons/star.svg" alt="año" width={16} height={16} />
                <span className="text-sm text-light-100">{book.anoPublicacion}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookList;