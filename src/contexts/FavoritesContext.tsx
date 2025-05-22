
import React, { createContext, useContext, useState, useEffect } from "react";
import { Recipe } from "@/types/recipe";
import { useToast } from "@/components/ui/use-toast";

interface FavoritesContextType {
  favorites: Recipe[];
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const { toast } = useToast();

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error);
        localStorage.removeItem("favorites");
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (recipe: Recipe) => {
    if (!favorites.some((fav) => fav.id === recipe.id)) {
      setFavorites([...favorites, recipe]);
      toast({
        title: "Recipe added to favorites",
        description: `"${recipe.title}" has been added to your favorites.`,
      });
    }
  };

  const removeFavorite = (id: number) => {
    const recipe = favorites.find(fav => fav.id === id);
    setFavorites(favorites.filter((recipe) => recipe.id !== id));
    if (recipe) {
      toast({
        title: "Recipe removed from favorites",
        description: `"${recipe.title}" has been removed from your favorites.`,
      });
    }
  };

  const isFavorite = (id: number) => {
    return favorites.some((recipe) => recipe.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
