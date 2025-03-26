// components/TrendIndicator.tsx
import { ArrowUp } from "lucide-react";

export const TrendIndicator = ({ trend }: { trend: number }) => (
  <span className="ml-2 flex items-center text-xs text-green-600 font-medium">
    <ArrowUp className="h-3 w-3 mr-1" />
    {trend}%
  </span>
);