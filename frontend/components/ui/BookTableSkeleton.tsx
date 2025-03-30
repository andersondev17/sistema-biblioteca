import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BookTableSkeleton = () => {
    return (
        <div className="space-y-6">
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-blue-200/50">
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Género</TableHead>
                            <TableHead>Año</TableHead>
                            <TableHead>Autor</TableHead>
                            <TableHead className="w-[100px] text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index} className="animate-pulse">
                                <TableCell>
                                    <Skeleton className="h-4 w-full max-w-[200px]" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-20" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-12" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-32" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default BookTableSkeleton;