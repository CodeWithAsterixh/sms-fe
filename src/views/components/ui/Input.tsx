import React, { forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, placeholder, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          className={cn(
            "peer flex h-12 w-full rounded-md border border-input bg-background px-3 pt-5 pb-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus:placeholder:text-muted-foreground placeholder:opacity-70  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          placeholder={placeholder || " "}
          ref={ref}
          {...props}
        />
        {label && (
          <label className={cn(
            "absolute left-3 top-2 z-10 origin-left translate-y-0 scale-75 transform text-muted-foreground duration-200 pointer-events-none",
            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100",
            "peer-focus:top-0 peer-focus:translate-y-0 peer-focus:scale-75",
            error && "text-red-500 peer-focus:text-red-500"
          )}>
            {label}
          </label>
        )}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
