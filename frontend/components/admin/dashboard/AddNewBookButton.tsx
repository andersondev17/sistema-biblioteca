// components/AddNewBookButton.tsx
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const AddNewBookButton = () => (
  <Button asChild className="mt-4 w-full bg-white border border-dashed border-slate-300 text-primary-admin hover:bg-slate-50">
    <Link href="/admin/books/new" className="flex items-center justify-center gap-1">
      <Plus size={16} />
      Añadir Nuevo Libro
    </Link>
  </Button>
);