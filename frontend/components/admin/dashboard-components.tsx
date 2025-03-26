import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, User, Users } from "lucide-react";
import Link from "next/link";
import BookList from "../BookList";
import { AddNewBookButton } from "./dashboard/AddNewBookButton";
import { ViewAllButton } from "./dashboard/ViewAllButton";
export const StatCard = ({ title, value, trend, icon: Icon }: any) => {

    return (
        <Card className="bg-white border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">

            <CardContent className="flex items-center p-6">
                {Icon && (
                    <div className="mr-4 bg-gradient-to-br from-primary-admin/10 to-blue-300/10 p-3 rounded-full">
                        <Icon className="h-6 w-6 text-primary-admin" />
                    </div>
                )}

                <div>
                    <div className="flex items-center">
                        <p className="text-sm font-medium text-slate-500 font-ibm-plex-sans">{title}</p>
                        <span className={`ml-2 text-xs font-medium ${trend > 0 ? "text-green-600" : "text-red-600"} px-2 py-0.5 rounded-full ${trend > 0 ? "bg-green-50" : "bg-red-50"}`}>
                            {trend > 0 ? "+" : ""}{trend}%
                        </span>
                    </div>

                    <div className="flex items-center">
                        <h3 className="text-3xl font-bold text-slate-800 pt-2 font-bebas-neue tracking-wider">
                            {value}
                        </h3>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
export const QuickAccessGrid = () => {
    const cards = [
        { title: "Gestión de Usuarios", description: "Administra usuarios del sistema", href: "/admin/users", icon: Users, gradient: "from-primary-admin/90 to-blue-600/90", bgGradient: "from-primary-admin/10 to-blue-600/10" },
        { title: "Catálogo de Libros", description: "Administra el catálogo completo", href: "/admin/books", icon: BookOpen, gradient: "from-amber-500/90 to-orange-600/90", bgGradient: "from-amber-500/10 to-orange-600/10" },
        { title: "Directorio de Autores", description: "Gestiona información de autores", href: "/admin/authors", icon: User, gradient: "from-green-500/90 to-green-600/90", bgGradient: "from-green-500/10 to-green-600/10" },
    ];

    return (
        <div className=" sm:grid-cols-2 gap-6">
            {cards.map((card) => (
                <Link key={card.title} href={card.href} className="block h-full">
                    <Card className="border border-slate-200/50 shadow-sm h-full relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}></div>
                        <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${card.gradient}`}></div>

                        <CardContent className="p-6 relative z-10 flex items-center">
                            <div className={`mr-5 rounded-full p-3 bg-gradient-to-br ${card.gradient} text-white transform transition-transform duration-300 group-hover:scale-110`}>
                                <card.icon size={24} />
                            </div>

                            <div>
                                <h3 className="text-xl font-bebas-neue tracking-wide text-slate-800 group-hover:text-slate-900 transition-colors">
                                    {card.title}
                                </h3>
                                <p className="text-sm text-slate-500 font-ibm-plex-sans mt-1 group-hover:text-slate-700 transition-colors">
                                    {card.description}
                                </p>
                            </div>

                            <div className="ml-auto opacity-0 transform translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                <div className="rounded-full bg-white/80 p-2 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
                                        <path d="M5 12h14"></path>
                                        <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
};


export const RecentBooks = ({ books }: { books: any[] }) => {
    const dummyAuthors = [
        { cedula: "default", nombreCompleto: "Autor Desconocido", nacionalidad: "some-nationality" }
    ];

    return (
        <Card className="border-slate-200/70 shadow-md overflow-hidden relative hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>

            <CardHeader className="pb-3 bg-gradient-to-br from-amber-500/5 to-orange-600/5">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bebas-neue tracking-wide flex items-center">
                        <BookOpen className="mr-2 h-5 w-5 text-amber-500" />
                        Libros Recientes
                    </CardTitle>
                    <ViewAllButton href="/admin/books" />
                </div>
            </CardHeader>

            <CardContent className="p-3 pt-5">
                <AddNewBookButton />
                <div className="mt-4">
                    <BookList
                        title="Últimos Registros"
                        books={books}
                        authors={dummyAuthors}
                        containerClassname="mt-4"
                        isAuthenticated={true}
                    />
                </div>
            </CardContent>
        </Card>
    );
};