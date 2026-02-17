import React from "react";
import { cn } from "../../../utils/cn";

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

  const baseClasses = "relative flex shrink-0 overflow-hidden rounded-full bg-gray-200 items-center justify-center font-bold text-gray-500 uppercase border border-gray-100 shadow-sm";

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
        />
      ) : (
        <span>{fallback?.slice(0, 2) || "??"}</span>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";
