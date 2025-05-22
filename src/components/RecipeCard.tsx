
import { Link } from "react-router-dom";
import { Recipe, RecipeSearchItem } from "@/types/recipe";
import { useFavorites } from "@/contexts/FavoritesContext";

type RecipeCardProps = {
  recipe: Recipe | RecipeSearchItem;
  className?: string;
};

export function RecipeCard({ recipe, className = "" }: RecipeCardProps) {
  const { isFavorite } = useFavorites();
  
  return (
    <div className={`recipe-card ${className}`}>
      <Link to={`/recipe/${recipe.id}`} className="block">
        <div className="relative aspect-video">
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          {isFavorite(recipe.id) && (
            <div className="absolute top-2 right-2 bg-white rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="#FF8A65" viewBox="0 0 24 24" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium line-clamp-2 h-14">{recipe.title}</h3>
          {'readyInMinutes' in recipe && (
            <div className="flex items-center text-neutral-500 text-sm mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {recipe.readyInMinutes} mins
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
