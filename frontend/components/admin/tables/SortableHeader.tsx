import { TableHead } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

const SortableHeader = ({ field, currentField, direction, children, onClick }: {
    field: string;
    currentField: string;
    direction: "asc" | "desc";
    children: React.ReactNode;
    onClick: (field: string) => void;
}) => (
    <TableHead
        className="cursor-pointer hover:bg-blue-300 transition-colors text-primary-admin font-medium"
        onClick={() => onClick(field)}
    >
        <div className="flex items-center gap-1">
            {children}
            <ArrowUpDown className={`h-3.5 w-3.5 ${field === currentField ? "text-primary-admin" : "text-primary-admin/70"}`} />
        </div>
    </TableHead>
);

export default SortableHeader;