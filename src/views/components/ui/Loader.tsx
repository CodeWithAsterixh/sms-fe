import { Loader2 } from "lucide-react";
import { cn } from "../../../utils/cn";

interface LoaderProps {
  className?: string;
  size?: number;
}

export const Loader = ({ className, size }: LoaderProps) => {
  return (
    <div className={cn("flex justify-center items-center", !className && "p-4")}>
      <Loader2 className={cn("animate-spin text-primary", className || "h-8 w-8")} size={size} />
    </div>
  );
};
