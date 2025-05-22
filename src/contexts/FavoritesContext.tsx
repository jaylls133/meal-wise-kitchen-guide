
import React, { createContext, useContext, useState, useEffect } from "react";
import { Recipe } from "@/types/recipe";
import { useToast } from "@/components/ui/use-toast";

interface FavoritesContextType {
  favorites: Recipe[];
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clearExpiredFavorites: () => void;
}

interface StoredFavoritesData {
  favorites: Recipe[];
  expiryDate: string;
}

const STORAGE_KEY = "favorites";
const EXPIRY_DAYS = 30;

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const { toast } = useToast();

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const loadFavorites = () => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (!savedData) return;
      
      try {
        const parsedData: StoredFavoritesData = JSON.parse(savedData);
        
        // Check if the data is expired
        const expiryDate = new Date(parsedData.expiryDate);
        const now = new Date();
        
        if (expiryDate > now) {
          // Data is still valid
          setFavorites(parsedData.favorites);
        } else {
          // Data is expired, clear it
          localStorage.removeItem(STORAGE_KEY);
          toast({
            title: "Favorites expired",
            description: "Your saved favorites have expired after 30 days and have been cleared.",
          });
        }
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    };
    
    loadFavorites();
  }, [toast]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (favorites.length > 0) {
      // Calculate expiry date (30 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + EXPIRY_DAYS);
      
      const dataToStore: StoredFavoritesData = {
        favorites,
        expiryDate: expiryDate.toISOString(),
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } else {
      // If no favorites, remove the item from localStorage
      localStorage.removeItem(STORAGE_KEY);
    }
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

  const clearExpiredFavorites = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFavorites([]);
    toast({
      title: "Favorites cleared",
      description: "All your saved favorites have been cleared.",
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, clearExpiredFavorites }}>
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
