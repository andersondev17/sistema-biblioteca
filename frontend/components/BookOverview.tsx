'use client'

import { sampleBooks } from '@/constants'
import Image from "next/image"
import AuthorDrawer from './AuthorDrawer'
import { Button } from "./ui/button"
import {
  Drawer,
  DrawerTrigger
} from "./ui/drawer"

// Usando el nuevo tipo LibroConAutor para la página principal
const BookOverview = ({ 
  editorial, 
  genero, 
  anoPublicacion, 
  autorCedula, 
  nombreCompleto, 
  nacionalidad,
  cover,
  isbn
}: LibroConAutor) => {
  // Filtrar libros del mismo autor para el drawer
  const authorBooks = sampleBooks.filter(book => book.autorCedula === autorCedula);
  
  // Información del autor para el drawer
  const autorInfo: Autor = {
    cedula: autorCedula,
    nombreCompleto: nombreCompleto || '',
    nacionalidad: nacionalidad || ''
  };

  // Mock del estado de administrador
  const isAdmin = false;

  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{editorial}</h1>

        <div className="book-info">
          <p>
            By<span className="font-semibold text-light-200"> {nombreCompleto}</span>
          </p>

          <p>
            Genero<span className="font-semibold text-light-200"> {genero}</span>
          </p>

          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p>{anoPublicacion}</p>
          </div>
        </div>

        <Drawer>
          <DrawerTrigger asChild>
            <Button className="book-overview_btn">
              <Image src="/icons/book.svg" alt="book" width={20} height={20} />
              <p className="font-bebas-neue text-xl text-dark-100">Ver info del autor</p>
            </Button>
          </DrawerTrigger>
          <AuthorDrawer 
            autor={autorInfo}
            libros={authorBooks}
            isAdmin={isAdmin}
          />
        </Drawer>
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