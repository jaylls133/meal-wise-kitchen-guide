
import { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { findRecipesByIngredients } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface IngredientRecipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  likes: number;
}

const Ingredients = () => {
  const [ingredients, setIngredients] = useState<string>("");
  const [excludeIngredients, setExcludeIngredients] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<IngredientRecipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!ingredients.trim()) {
      setError("Please enter at least one ingredient");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const results = await findRecipesByIngredients(ingredients);
      setRecipes(results);
      setHasSearched(true);
    } catch (err) {
      console.error("Error finding recipes by ingredients:", err);
      setError("Failed to find recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container-custom py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Find Recipes by Ingredients</h1>
        <p className="text-neutral-600 mb-8">
          Enter ingredients you have, separated by commas, and we'll find matching recipes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6">Your Ingredients</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Ingredients You Have
                </label>
                <textarea
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g., tomato, cheese, basil"
                  className="w-full p-3 border border-neutral-200 rounded-md h-24"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Separate ingredients with commas
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Ingredients to Exclude (optional)
                </label>
                <textarea
                  value={excludeIngredients}
                  onChange={(e) => setExcludeIngredients(e.target.value)}
                  placeholder="e.g., mushrooms, olives"
                  className="w-full p-3 border border-neutral-200 rounded-md h-24"
                />
              </div>
              
              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Searching..." : "Find Recipes"}
              </Button>
              
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </div>
          </div>
          
          {/* Results */}
          <div className="md:col-span-2">
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-6">
                    <Skeleton className="w-full md:w-48 h-32" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recipes.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Recipe Matches</h2>
                
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="bg-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-6">
                    <Link to={`/recipe/${recipe.id}`} className="block w-full md:w-48 h-32">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/recipe/${recipe.id}`} className="font-bold text-lg hover:text-primary">
                        {recipe.title}
                      </Link>
                      
                      <div className="flex gap-6 mt-3">
                        <div>
                          <span className="text-sm font-medium text-green-600">
                            {recipe.usedIngredientCount} ingredients matched
                          </span>
                        </div>
                        {recipe.missedIngredientCount > 0 && (
                          <div>
                            <span className="text-sm font-medium text-amber-600">
                              {recipe.missedIngredientCount} ingredients missing
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <Link
                          to={`/recipe/${recipe.id}`}
                          className="text-primary hover:text-primary-700 font-medium"
                        >
                          View Recipe
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : hasSearched ? (
              <div className="bg-neutral-50 p-8 rounded-xl text-center">
                <h3 className="text-xl font-medium mb-2">No Recipes Found</h3>
                <p className="text-neutral-600">
                  Try different ingredients or check the spelling of your input.
                </p>
              </div>
            ) : (
              <div className="bg-neutral-50 p-8 rounded-xl text-center flex flex-col items-center">
                <div className="bg-primary-100 p-4 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Find Recipes with Your Ingredients</h3>
                <p className="text-neutral-600 max-w-md mx-auto">
                  Enter ingredients you have on hand to find recipes you can make right now.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Ingredients;
