"use client";

import BookTable from "@/components/admin/tables/BookTable";
import { Button } from "@/components/ui/button";
import AuthorService from "@/services/author.service";
import BookService from "@/services/book.service";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BooksPage() {
  const [books, setBooks] = useState<LibroView[]>([]);
  const [authors, setAuthors] = useState<Autor[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [booksData, authorsData] = await Promise.all([
        BookService.getAllBooks(),
        AuthorService.getAllAuthors()
      ]);
      setBooks(booksData);
      setAuthors(authorsData);
    } catch (error) {
      toast.error("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Gestión de Libros</h1>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/books/new" className="flex items-center justify-center gap-2 bg-primary-admin hover:bg-blue-300 text-white px-4 py-2 rounded-md shadow-sm">
            <Plus size={16} />
            <span>Nuevo Libro</span>
          </Link>
        </Button>
      </div>
      <BookTable books={books} authors={authors} />
    </div>
  );
}