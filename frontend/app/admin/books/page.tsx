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
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Libros</h1>
        <Button asChild>
          <Link href="/admin/books/new" className="flex items-center gap-2">
            <Plus size={16} />
            Nuevo Libro
          </Link>
        </Button>
        </div>
      <BookTable books={books} authors={authors} />
    </div>
  );
}