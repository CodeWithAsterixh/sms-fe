import { NavLink } from "react-router";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../../../store/auth.store";
import { cn } from "../../../utils/cn";
import { NAVIGATION_LINKS } from "../../../config/navigation";

const Sidebar = () => {
  const { logout, user } = useAuthStore();

  const visibleLinks = NAVIGATION_LINKS.filter(link => {
    if (!link.permission) return true;
    return user?.permissions?.includes(link.permission) || user?.role === 'admin';
  });

  return (
    <aside className="hidden md:flex w-64 bg-card border-r min-h-screen flex-col sticky top-0 h-screen">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary">SMS</h1>
        <p className="text-xs text-muted-foreground mt-1">School Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
