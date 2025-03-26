'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Edit, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RecentBook {
    isbn: string;
    cover?: string;
    editorial: string;
    author: string;
    genero: string;
    date: string;
}

const RecentBooksList = ({ books = [] }: { books: RecentBook[] }) => (
    <Card className="border-slate-200/70 shadow-md hover:shadow-lg transition-all h-full font-bebas-neue">
        <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
                <CardTitle className="text-lg tracking-wide">Añadidos Recientemente</CardTitle>
                <Button variant="link" className="text-primary-admin h-8 px-1" asChild>
                    <Link href="/admin/books" className="flex items-center gap-1 group">
                        Ver todos
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            className="transform transition-transform group-hover:translate-x-1 text-primary-admin">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </Button>
            </div>
        </CardHeader>

        <CardContent className="px-3 pb-5">
            <Button asChild variant="outline" className="w-full mb-4 font-ibm-plex-sans shadow-sm">
                <Link href="/admin/books/new" className="gap-2">
                    <Plus size={14} className="text-primary-admin hover:bg-primary-admin/10" />
                    Añadir Nuevo Libro
                </Link>
            </Button>

            <div className="space-y-3">
                {books.map(book => (
                    <div key={book.isbn} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all">
                        <div className="relative h-16 w-12 flex-shrink-0 rounded-md overflow-hidden">
                            {book.cover ? (
                                <Image src={book.cover} alt={book.editorial} fill sizes="48px"
                                    className="object-cover hover:scale-105 transition-transform" />
                            ) : (
                                <div className="h-full bg-gradient-to-br from-amber-100 to-orange-100 flex-center">
                                    <Book size={20} className="text-amber-500" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-slate-800 truncate">{book.editorial}</h4>
                            <div className="flex items-center text-xs text-slate-500 truncate">
                                Por {book.author} • {book.genero}
                            </div>
                            <div className="mt-1 text-xs text-slate-400 flex items-center">
                                <span className="size-2 bg-amber-300 rounded-full mr-1.5" />
                                {book.date}
                            </div>
                        </div>

                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-all" asChild>
                            <Link href={`/admin/books/edit/${book.isbn}`}>
                                <Edit className="h-4 w-4 text-amber-500" />
                            </Link>
                        </Button>
                    </div>
                ))}

                {!books.length && (
                    <div className="py-10 text-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-dashed border-amber-200">
                        <Book size={40} className="text-amber-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 font-ibm-plex-sans">No hay libros recientes</p>
                        <Button variant="link" className="text-amber-500 mt-2" asChild>
                            <Link href="/admin/books/new">Añadir un libro</Link>
                        </Button>
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
);

export default RecentBooksList;