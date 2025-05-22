
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { getRecipeById } from "@/services/api";
import { Recipe } from "@/types/recipe";
import { useFavorites } from "@/contexts/FavoritesContext";
import { RecipeDetailsSkeleton } from "@/components/RecipeDetailsSkeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const RecipeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await getRecipeById(parseInt(id));
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!recipe) return;
    
    if (isFavorite(recipe.id)) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container-custom py-12">
          <RecipeDetailsSkeleton />
        </div>
      </MainLayout>
    );
  }

  if (!recipe) {
    return (
      <MainLayout>
        <div className="container-custom py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Recipe Not Found</h1>
          <p>We couldn't find the recipe you're looking for.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-custom py-12">
        <div className="space-y-8">
          {/* Recipe Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{recipe.title}</h1>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                {recipe.readyInMinutes} mins
              </span>
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                {recipe.servings} servings
              </span>
              
              {recipe.vegetarian && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Vegetarian
                </span>
              )}
              
              {recipe.vegan && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Vegan
                </span>
              )}
              
              {recipe.glutenFree && (
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                  Gluten Free
                </span>
              )}
              
              {recipe.dairyFree && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  Dairy Free
                </span>
              )}
            </div>
            
            <Button
              onClick={handleFavoriteToggle}
              className={isFavorite(recipe.id) ? "bg-secondary hover:bg-secondary-600" : ""}
            >
              {isFavorite(recipe.id) ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          </div>
          
          {/* Recipe Image */}
          <div className="relative aspect-video md:aspect-[16/9] rounded-xl overflow-hidden">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
          {/* Recipe Summary */}
          <div className="bg-neutral-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">About this Recipe</h2>
            <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />
          </div>
          
          <Separator />
          
          {/* Recipe Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Ingredients */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.analyzedInstructions[0]?.steps.flatMap(step => step.ingredients).filter((ingredient, index, self) => 
                  index === self.findIndex(i => i.id === ingredient.id)
                ).map(ingredient => (
                  <li key={ingredient.id} className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-2"></span>
                    <span>{ingredient.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Instructions */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Instructions</h2>
              <ol className="space-y-6">
                {recipe.analyzedInstructions[0]?.steps.map(step => (
                  <li key={step.number} className="flex">
                    <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-4">
                      {step.number}
                    </span>
                    <p>{step.step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          {/* Nutrition Info */}
          {recipe.healthScore && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Nutrition</h2>
              <div className="bg-neutral-50 p-6 rounded-xl">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                    {recipe.healthScore}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-lg">Health Score</h3>
                    <p className="text-neutral-600">
                      {recipe.healthScore < 40 ? 'Not very healthy' : 
                       recipe.healthScore < 70 ? 'Moderately healthy' : 
                       'Very healthy'}
                    </p>
                  </div>
                </div>
                
                <p className="text-neutral-600">
                  Price per serving: ${(recipe.pricePerServing / 100).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default RecipeDetails;
