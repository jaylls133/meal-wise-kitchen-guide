
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
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
    <header className="bg-white dark:bg-neutral-900 shadow-sm sticky top-0 z-10">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-primary dark:text-primary-300 font-heading font-bold text-2xl">FoodGenius</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "transition-colors text-sm font-medium py-1",
                  isActive(link.href) 
                    ? "text-primary dark:text-primary-300 border-b-2 border-primary dark:border-primary-300"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-300"
                )}
              >
                {link.name}
              </Link>
            ))}
            <ThemeToggle />
          </nav>
          
          {/* Mobile Navigation Toggle */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden text-neutral-800 dark:text-neutral-200 focus:outline-none">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white dark:bg-neutral-900 w-[250px]">
              <div className="flex flex-col space-y-4 mt-6">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-3 py-2 rounded-md text-base font-medium",
                      isActive(link.href)
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary dark:text-primary-300"
                        : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary dark:hover:text-primary-300"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="px-3 py-2">
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
