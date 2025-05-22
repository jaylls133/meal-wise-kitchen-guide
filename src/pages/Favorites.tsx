
import { MainLayout } from "@/layouts/MainLayout";
import { RecipeCard } from "@/components/RecipeCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Link } from "react-router-dom";

const Favorites = () => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <MainLayout>
      <div className="container-custom py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Your Favorite Recipes</h1>
        
        {favorites.length > 0 ? (
          <>
            <p className="text-neutral-600 mb-8">
              You have saved {favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'} to your favorites.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map((recipe) => (
                <div key={recipe.id} className="relative">
                  <button
                    onClick={() => removeFavorite(recipe.id)}
                    className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-sm hover:bg-neutral-100"
                    aria-label="Remove from favorites"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#FF8A65" viewBox="0 0 24 24" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-neutral-50 p-12 rounded-xl text-center flex flex-col items-center max-w-xl mx-auto">
            <div className="bg-neutral-100 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-neutral-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-3">No favorite recipes yet</h2>
            <p className="text-neutral-600 mb-6">
              Start exploring recipes and save your favorites for quick access later.
            </p>
            <div className="flex gap-4">
              <Link
                to="/search"
                className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-600 transition-colors"
              >
                Search Recipes
              </Link>
              <Link
                to="/"
                className="px-6 py-3 bg-white text-neutral-700 border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors"
              >
                Go to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Favorites;
