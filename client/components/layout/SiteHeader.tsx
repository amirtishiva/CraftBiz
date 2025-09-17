import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

export default function SiteHeader() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [user, setUser] = React.useState<{ name: string; email: string } | null>(null);

  React.useEffect(() => {
    const readUser = () => {
      const data = localStorage.getItem("user");
      setUser(data ? JSON.parse(data) : null);
    };
    readUser();
    const handleAuthChanged = () => readUser();
    window.addEventListener("auth:changed", handleAuthChanged);
    window.addEventListener("storage", handleAuthChanged);
    return () => {
      window.removeEventListener("auth:changed", handleAuthChanged);
      window.removeEventListener("storage", handleAuthChanged);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/70 bg-background/80 border-b border-border/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 py-1">
          <img
            src="/craftbriz-logo.svg"
            alt="CraftBriz"
            className="block h-8 md:h-9 w-auto"
            loading="eager"
            decoding="async"
          />
        </Link>
        {/* Show nav only when authenticated */}
        {user && (
          <nav className="hidden md:flex items-center gap-2">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                cn(
                  "px-3 py-1.5 rounded-full text-sm border transition-colors",
                  isActive
                    ? "bg-secondary text-foreground border-border"
                    : "hover:bg-accent border-transparent",
                )
              }
            >
              Projects
            </NavLink>
            {/* Docs removed per request */}
          </nav>
        )}
        <div className="flex items-center gap-2">
          {!user && (
            <Button asChild className="rounded-full h-9 px-5">
              <Link to="/signin">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
