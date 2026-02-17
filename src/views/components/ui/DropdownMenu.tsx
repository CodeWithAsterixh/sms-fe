import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../../utils/cn";

interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
}

interface DropdownTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface DropdownContentProps {
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  danger?: boolean;
}

const DropdownContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
} | undefined>(undefined);

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={menuRef} className={cn("relative inline-block text-left", className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownTrigger: React.FC<DropdownTriggerProps> = ({ children, onClick, className }) => {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error("DropdownTrigger must be used within a DropdownMenu");

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    context.setIsOpen(!context.isOpen);
    if (onClick) onClick();
  };

  return (
    <div onClick={handleClick} className={cn("cursor-pointer", className)}>
      {children}
    </div>
  );
};

export const DropdownContent: React.FC<DropdownContentProps> = ({ children, align = "right", className }) => {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error("DropdownContent must be used within a DropdownMenu");

  if (!context.isOpen) return null;

  return (
    <div
      className={cn(
        "absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none",
        align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
        className
      )}
    >
      <div className="py-1" role="menu" aria-orientation="vertical">
        {children}
      </div>
    </div>
  );
};

export const DropdownItem: React.FC<DropdownItemProps> = ({ children, onClick, className, danger }) => {
  const context = React.useContext(DropdownContext);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick();
    context?.setIsOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "block w-full text-left px-4 py-2 text-sm",
        danger ? "text-red-700 hover:bg-red-50" : "text-gray-700 hover:bg-gray-100",
        className
      )}
      role="menuitem"
    >
      {children}
    </button>
  );
};
