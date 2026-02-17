import React from "react";
import { cn } from "../../../utils/cn";
import { User } from "lucide-react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({
  src,
  alt,
  fallback,
  size = "md",
  className,
  ...props
}, ref) => {
  const [error, setError] = React.useState(false);

  // Reset error state when src changes
  React.useEffect(() => {
    setError(false);
  }, [src]);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-lg",
    xl: "h-24 w-24 text-xl",
    "2xl": "h-32 w-32 text-2xl",
  };

  const baseClasses = "relative flex shrink-0 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800 items-center justify-center font-bold text-neutral-600 dark:text-neutral-300 uppercase border border-neutral-200 dark:border-neutral-700 shadow-sm";

  return (
    <div
      ref={ref}
      className={cn(baseClasses, sizeClasses[size], className)}
      {...props}
    >
      {src && !error ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="aspect-square h-full w-full object-cover"
          onError={() => setError(true)}
          loading="lazy"
        />
      ) : (
        <span className="flex items-center justify-center w-full h-full">
          {fallback ? (
            fallback.slice(0, 2)
          ) : (
            <User className="w-1/2 h-1/2 opacity-50" />
          )}
        </span>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";
