
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { GlassContainer } from "../ui/glass-container";
import { FileText, Home } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/invoice", label: "Invoice", icon: FileText },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300">
      <GlassContainer
        intensity={scrolled ? "medium" : "light"}
        className={cn(
          "mx-auto flex items-center justify-between px-4 py-2",
          "transition-all duration-300 ease-in-out",
          scrolled ? "shadow-md" : "shadow-sm"
        )}
      >
        <div className="flex items-center space-x-1">
          <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            InvoiceRaptor
          </span>
        </div>
        
        <nav className="hidden sm:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 group",
                  "hover:bg-accent/50 focus-ring",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Icon size={16} />
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="sm:hidden flex items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "p-2 rounded-full transition-all duration-200",
                  "hover:bg-accent/50 focus-ring",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={item.label}
              >
                <Icon size={20} />
              </Link>
            );
          })}
        </div>
      </GlassContainer>
    </header>
  );
}
