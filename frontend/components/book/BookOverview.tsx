'use client'

import AuthService from "@/services/auth.service";
import Image from "next/image";
import AuthorDrawer from '../AuthorDrawer';
import { Button } from "../ui/button";
import { Drawer, DrawerTrigger } from "../ui/drawer";
import { Skeleton } from "../ui/skeleton";

// Redefinir el tipo correctamente
type BookOverviewProps = {
  isbn: string;
  libro?: Libro; 
  autor?: Autor;
  relatedBooks?: LibroView[];
}

const BookOverview = ({ isbn, libro, autor, relatedBooks = [] }: BookOverviewProps) => {
  // Simplificamos - no hacemos peticiones aquí
  const isAdmin = AuthService.isAdmin?.() || false;
  
  if (!libro) {
    return (
      <section className="book-overview">
        <div className="flex flex-1 flex-col gap-5">
          <Skeleton className="h-16 w-3/4 bg-dark-400" />
          <div className="book-info">
            <Skeleton className="h-6 w-32 bg-dark-400" />
            <Skeleton className="h-6 w-32 bg-dark-400" />
          </div>
          <Skeleton className="h-14 w-48 bg-dark-400" />
        </div>
        <div className="relative flex flex-1 justify-center">
          <Skeleton className="aspect-[2/3] w-[300px] rounded-lg bg-dark-400" />
        </div>
      </section>
    );
  }

  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{libro.editorial}</h1>

        <div className="book-info">
          {autor && (
            <p>
              By<span className="font-semibold text-light-200"> {autor.nombreCompleto}</span>
            </p>
          )}

          <p>
            Genero<span className="font-semibold text-light-200"> {libro.genero}</span>
          </p>

          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p>{libro.anoPublicacion}</p>
          </div>
        </div>

        {autor && (
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="book-overview_btn">
                <Image src="/icons/book.svg" alt="book" width={20} height={20} />
                <p className="font-bebas-neue text-xl text-dark-100">Ver info del autor</p>
              </Button>
            </DrawerTrigger>
            <AuthorDrawer 
              autor={autor}
              libros={relatedBooks}
              isAdmin={isAdmin}
            />
          </Drawer>
        )}
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          {libro.cover && <Image src={libro.cover} alt={libro.editorial} width={300} height={450} className="rounded-lg" />}

          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            {libro.cover && <Image src={libro.cover} alt={libro.editorial} width={300} height={450} className="rounded-lg" />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookOverview;