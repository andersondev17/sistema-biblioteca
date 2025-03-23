"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ComponentType } from "react";
import { Skeleton } from "../ui/skeleton"; // Asegúrate de importar este componente

export const ActionButton = ({
    icon: Icon,
    href,
    onClick,
    color,
    loading = false
}: {
    icon: ComponentType;
    href?: string;
    onClick?: () => void;
    color: string;
    loading?: boolean;
}) => (
    <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 hover:text-${color}`}
        asChild={!!href}
        onClick={onClick}
        disabled={loading}
    >
        {href ? (
            <Link href={href} className="flex items-center justify-center">
                {loading ? <Skeleton /> : <Icon  />}
            </Link>
        ) : (
            <span className="flex items-center justify-center">
                {loading ? <Skeleton /> : <Icon  />}
            </span>
        )}
    </Button>
);