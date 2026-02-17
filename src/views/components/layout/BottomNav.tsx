import { NavLink } from "react-router";
import { NAVIGATION_LINKS } from "../../../config/navigation";
import { useAuthStore } from "../../../store/auth.store";
import { cn } from "../../../utils/cn";
import { LogOut } from "lucide-react";

const BottomNav = () => {
  const { user, logout } = useAuthStore();

  const visibleLinks = NAVIGATION_LINKS.filter(link => {
    if (!link.permission) return true;
    return user?.permissions?.includes(link.permission) || user?.role === 'admin';
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t flex items-center justify-around h-16 md:hidden px-2 pb-safe">
      {visibleLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors gap-1",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          <link.icon className="h-5 w-5" />
          <span>{link.label}</span>
        </NavLink>
      ))}
      <button
        onClick={logout}
        className="flex flex-col items-center justify-center w-full h-full text-xs font-medium text-muted-foreground hover:text-destructive transition-colors gap-1"
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </nav>
  );
};

export default BottomNav;
