'use client'

import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Book, Edit } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface AuthorDrawerProps {
    autor: Autor;
    libros: LibroView[];
    isAdmin?: boolean;
}

const AuthorDrawer = ({ autor, libros = [], isAdmin = false }: AuthorDrawerProps) => {
    const router = useRouter();
    
    const handleEditAuthor = () => {
        if (isAdmin && autor.cedula) {
            router.push(`/admin/authors/edit/${autor.cedula}`);
        }
    };
    
    return (
        <DrawerContent className="bg-dark-300 border-t border-gray-800">
            <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-gray-600/50" />

            <div className="mx-auto w-full max-w-md px-4 sm:px-6">
                <DrawerHeader>
                    <DrawerTitle className="text-2xl font-semibold text-light-200">
                        {autor.nombreCompleto || 'Autor'}
                    </DrawerTitle>
                    <DrawerDescription className="text-light-100">
                        Cédula: {autor.cedula || 'N/A'} • Nacionalidad: {autor.nacionalidad || 'N/A'}
                    </DrawerDescription>
                </DrawerHeader>

                <div className="py-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Book size={20} className="text-primary" />
                        <h3 className="text-xl font-semibold text-light-200">Libros del autor</h3>
                    </div>

                    {libros.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto hide-scrollbar">
                            {libros.map((libro) => (
                                <div key={libro.isbn} className="rounded-lg bg-dark-400 p-4 transition-all hover:bg-dark-600">
                                    {libro.cover && (
                                        <div className="mb-2 overflow-hidden rounded-md aspect-[2/3]">
                                            <Image
                                                src={libro.cover}
                                                alt={libro.editorial}
                                                width={150}
                                                height={225}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <h4 className="book-title">{libro.editorial}</h4>
                                    <p className="book-genre">{libro.genero}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Image src="/icons/star.svg" alt="año" width={16} height={16} />
                                        <span className="text-sm text-light-100">{libro.anoPublicacion}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg bg-dark-400/50 p-4 text-center">
                            <p className="text-light-500">No hay libros registrados para este autor</p>
                        </div>
                    )}
                </div>

                <DrawerFooter className="flex-row gap-3 sm:flex-row sm:justify-end">
                    {isAdmin && (
                        <Button 
                            className="bg-primary-admin text-white hover:bg-primary-admin/90 flex-1 sm:flex-none"
                            onClick={handleEditAuthor}
                        >
                            <Edit size={16} className="mr-2" />
                            Editar autor
                        </Button>
                    )}
                    <DrawerClose asChild>
                        <Button variant="outline" className="border-light-100/20 text-light-100 hover:bg-dark-600 flex-1 sm:flex-none">
                            Cerrar
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </div>
        </DrawerContent>
    );
};

export default AuthorDrawer;