'use client'

import AuthorDrawer from "@/components/AuthorDrawer"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerTrigger } from "@/components/ui/drawer"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface BookOverviewProps {
  isbn: string;
  libro: LibroView;
  autor: Autor;
  relatedBooks: LibroView[];
  isAuthenticated?: boolean;
  onAuthRequiredAction?: (action: () => void) => void;
}

const BookOverview = ({   isbn,   libro,   autor,   relatedBooks,   isAuthenticated = false,  onAuthRequiredAction}: BookOverviewProps) => {
  const { editorial, genero, anoPublicacion, cover } = libro;
  const { nombreCompleto, nacionalidad, cedula } = autor;
  const router = useRouter();

  const handleReportClick = () => {
    if (onAuthRequiredAction) {
      onAuthRequiredAction(() => router.push(`/reports/${cedula}`));
    } else if (isAuthenticated) {
      router.push(`/reports/${cedula}`);
    }
  };

  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{editorial}</h1>

        <div className="book-info">
          <p>
            Por<span className="font-semibold text-light-200"> {nombreCompleto}</span>
          </p>

          <p>
            Género<span className="font-semibold text-light-200"> {genero}</span>
          </p>

          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p>{anoPublicacion}</p>
          </div>
          
          {nacionalidad && (
            <p>
              Nacionalidad<span className="font-semibold text-light-200"> {nacionalidad}</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-2">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="book-overview_btn">
                <Image src="/icons/book.svg" alt="book" width={20} height={20} />
                <p className="font-bebas-neue text-xl text-dark-100">Ver info del autor</p>
              </Button>
            </DrawerTrigger>
            <AuthorDrawer 
              autor={autor}
              libros={[libro, ...relatedBooks]}
              isAdmin={isAuthenticated && false} 
            />
          </Drawer>

          
        </div>
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          {cover && <Image src={cover} alt={editorial} width={300} height={450} className="rounded-lg" />}

          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            {cover && <Image src={cover} alt={editorial} width={300} height={450} className="rounded-lg" />}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookOverview