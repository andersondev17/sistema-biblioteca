'use client'

import AuthService from "@/services/auth.service";
import { useMemo } from "react";
import BookCard from "./book/BookCard";
import { Skeleton } from "./ui/skeleton";

type BookListProps = {
  title: string;
  books: LibroView[];
  authors: Autor[];
  containerClassname?: string;
  onBookSelect?: (isbn: string) => void;
  selectedBookISBN?: string;
  loading?: boolean;
}

const BookList = ({ 
  title, 
  books = [], 
  authors = [], 
  containerClassname,
  onBookSelect, 
  selectedBookISBN,
  loading = false
}: BookListProps) => {
  const isAdmin = AuthService.isAdmin?.() || false;
  
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
          <BookCard
            key={book.isbn}
            book={book}
            author={authorMap.get(book.autorCedula)}
            isSelected={book.isbn === selectedBookISBN}
            isAdmin={isAdmin}
            onClick={() => onBookSelect?.(book.isbn)}
          />
        ))}
      </div>
    </div>
  );
};

export default BookList;