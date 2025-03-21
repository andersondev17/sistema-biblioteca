'use client'

import Image from "next/image";
import AuthorDrawer from "../AuthorDrawer";
import { Drawer, DrawerTrigger } from "../ui/drawer";

type BookCardProps = {
    book: LibroView;
    author?: Autor;
    isSelected?: boolean;
    isAdmin?: boolean;
    onClick?: () => void;
}

const BookCard = ({ book, author, isSelected = false, isAdmin = false, onClick }: BookCardProps) => {
    // Determinar libros del mismo autor (si hay un autor)
    const authorBooks = [book];

    return (
        <button
            className={`text-left rounded-lg ${isSelected ? 'bg-dark-600 ring-2 ring-primary' : 'bg-dark-300 hover:bg-dark-600'} p-4 transition-all w-full`}
            onClick={onClick}
            aria-pressed={isSelected}
        >
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

            {author && (
                <div className="flex items-center gap-1 mt-2">
                    <span className="text-sm text-light-500">Por:</span>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <button
                                className="text-sm text-light-200 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {author.nombreCompleto}
                            </button>
                        </DrawerTrigger>
                        <AuthorDrawer
                            autor={author}
                            libros={authorBooks}
                            isAdmin={isAdmin}
                        />
                    </Drawer>
                </div>
            )}

            <div className="mt-2 flex items-center gap-2">
                <Image src="/icons/star.svg" alt="año" width={16} height={16} />
                <span className="text-sm text-light-100">{book.anoPublicacion}</span>
            </div>
        </button>
    );
};

export default BookCard;