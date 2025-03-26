// components/admin/QuickAccessCard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickAccessCardProps {
    title: string;
    href: string;
    icon: LucideIcon;
    color: string;
    description?: string;
    action?: string;
}

export const QuickAccessCard = ({
    title,
    href,
    icon: Icon,
    color,
    description = "Administración del sistema",
    action = "Ver más"
}: QuickAccessCardProps) => (
    <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
            <Icon className={`h-12 w-12 ${color}/70`} />
            <CardTitle className="text-lg mt-3">{title}</CardTitle>
            {description && <CardDescription className="text-sm text-slate-500">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
            <Button asChild variant="outline" className="w-full mt-2 border-slate-300">
                <Link href={href}>{action}</Link>
            </Button>
        </CardContent>
    </Card>
);