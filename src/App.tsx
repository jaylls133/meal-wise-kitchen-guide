
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ThemeProvider } from "@/components/ThemeProvider";

// Pages
import Index from "./pages/Index";
import Search from "./pages/Search";
import RecipeDetails from "./pages/RecipeDetails";
import MealPlanner from "./pages/MealPlanner";
import Ingredients from "./pages/Ingredients";
import Favorites from "./pages/Favorites";
import Nutrition from "./pages/Nutrition";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FavoritesProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/recipe/:id" element={<RecipeDetails />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/ingredients" element={<Ingredients />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FavoritesProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
