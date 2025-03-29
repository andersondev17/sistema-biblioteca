"use client";

import BookTable from "@/components/admin/tables/BookTable";
import { Button } from "@/components/ui/button";
import { useLibraryData } from "@/hooks/useLibraryData";
import { Plus } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { toast } from "sonner";

function BooksPage() {
  const { books, authors, loading, deleteBook } = useLibraryData();

  const handleDeleteBook = async (isbn: string) => {
    const success = await deleteBook(isbn);
    if (success) {
      toast.success("Libro eliminado exitosamente");
    } else {
      toast.error("Error al eliminar el libro");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Gestión de Libros</h1>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/books/new" className="flex items-center justify-center gap-2 bg-primary-admin hover:bg-primary-admin/90 text-white">
            <Plus size={16} />
            <span>Nuevo Libro</span>
          </Link>
        </Button>
      </div>
      
      <BookTable 
        books={books} 
        authors={authors} 
        loading={loading}
        onDelete={handleDeleteBook}
      />
    </div>
  );
}

export default memo(BooksPage);