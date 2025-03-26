// components/ViewAllButton.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const ViewAllButton = ({ href }: { href: string }) => (
  <Button variant="link" size="sm" asChild className="text-primary-admin h-8 px-1">
    <Link href={href}>Ver todos</Link>
  </Button>
);