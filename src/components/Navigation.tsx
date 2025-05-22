
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const links = [
    { name: "Home", href: "/" },
    { name: "Search", href: "/search" },
    { name: "Meal Planner", href: "/meal-planner" },
    { name: "Ingredients", href: "/ingredients" },
    { name: "Favorites", href: "/favorites" },
    { name: "Nutrition", href: "/nutrition" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-primary font-heading font-bold text-2xl">FoodGenius</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "transition-colors text-sm font-medium py-1",
                  isActive(link.href) 
                    ? "text-primary border-b-2 border-primary"
                    : "text-neutral-600 hover:text-primary"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* Mobile Navigation Toggle */}
          <button className="md:hidden text-neutral-800 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu (hidden by default) */}
      <div className="hidden md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive(link.href)
                  ? "bg-primary-50 text-primary"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
