
import { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Link } from "react-router-dom";
import { generateMealPlan } from "@/services/api";
import { MealPlan } from "@/types/recipe";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const diets = [
  { name: "Any", value: "" },
  { name: "Vegetarian", value: "vegetarian" },
  { name: "Vegan", value: "vegan" },
  { name: "Gluten Free", value: "gluten free" },
  { name: "Ketogenic", value: "ketogenic" },
  { name: "Paleo", value: "paleo" }
];

const MealPlanner = () => {
  const [targetCalories, setTargetCalories] = useState<number>(2000);
  const [diet, setDiet] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: Record<string, any> = {
        timeFrame: "day",
        targetCalories: targetCalories
      };
      
      if (diet) {
        params.diet = diet;
      }
      
      const plan = await generateMealPlan(params);
      setMealPlan(plan);
    } catch (err) {
      console.error("Error generating meal plan:", err);
      setError("Failed to generate meal plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container-custom py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Meal Planner</h1>
        <p className="text-neutral-600 mb-8">
          Generate a daily meal plan based on your dietary preferences and calorie goals.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6">Plan Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Target Calories (per day)
                </label>
                <input
                  type="number"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(Number(e.target.value))}
                  min="1000"
                  max="4000"
                  step="100"
                  className="w-full p-2 border border-neutral-200 rounded-md"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Recommended: 1800-2500 calories for adults
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Diet Type
                </label>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-full p-2 border border-neutral-200 rounded-md"
                >
                  {diets.map((diet) => (
                    <option key={diet.value} value={diet.value}>
                      {diet.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <Button 
                onClick={handleGeneratePlan}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Generating..." : "Generate Plan"}
              </Button>
              
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </div>
          </div>
          
          {/* Meal Plan Results */}
          <div className="md:col-span-2">
            {loading ? (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Skeleton className="h-8 w-2/3 mb-6" />
                
                <div className="space-y-10">
                  {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                    <div key={meal}>
                      <Skeleton className="h-6 w-1/3 mb-4" />
                      <div className="flex flex-col md:flex-row gap-6">
                        <Skeleton className="w-full md:w-48 h-32" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : mealPlan ? (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <h2 className="text-2xl font-bold">Your Daily Meal Plan</h2>
                  
                  <div className="bg-primary-50 p-3 rounded-lg mt-4 md:mt-0">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-xs text-neutral-500">Calories</div>
                        <div className="font-bold">{Math.round(mealPlan.nutrients.calories)}</div>
                      </div>
                      <Separator orientation="vertical" />
                      <div className="text-center">
                        <div className="text-xs text-neutral-500">Protein</div>
                        <div className="font-bold">{Math.round(mealPlan.nutrients.protein)}g</div>
                      </div>
                      <Separator orientation="vertical" />
                      <div className="text-center">
                        <div className="text-xs text-neutral-500">Carbs</div>
                        <div className="font-bold">{Math.round(mealPlan.nutrients.carbohydrates)}g</div>
                      </div>
                      <Separator orientation="vertical" />
                      <div className="text-center">
                        <div className="text-xs text-neutral-500">Fat</div>
                        <div className="font-bold">{Math.round(mealPlan.nutrients.fat)}g</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-10">
                  {mealPlan.meals.map((meal, index) => {
                    const mealLabels = ["Breakfast", "Lunch", "Dinner"];
                    return (
                      <div key={meal.id}>
                        <h3 className="font-bold text-lg text-neutral-800 mb-4">
                          {mealLabels[index]}
                        </h3>
                        <div className="flex flex-col md:flex-row gap-6">
                          <Link to={`/recipe/${meal.id}`} className="block w-full md:w-48 h-32">
                            <img
                              src={meal.image}
                              alt={meal.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </Link>
                          <div className="flex-1">
                            <Link to={`/recipe/${meal.id}`} className="font-bold text-lg hover:text-primary">
                              {meal.title}
                            </Link>
                            <p className="text-neutral-600 mt-1">
                              Ready in {meal.readyInMinutes} minutes • {meal.servings} servings
                            </p>
                            <div className="mt-4">
                              <Link 
                                to={`/recipe/${meal.id}`}
                                className="text-primary hover:text-primary-700 font-medium"
                              >
                                View Recipe
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-neutral-50 p-8 rounded-xl text-center flex flex-col items-center">
                <div className="bg-primary-100 p-4 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Generate Your Meal Plan</h3>
                <p className="text-neutral-600 max-w-md mx-auto">
                  Customize your calorie target and dietary preferences, then click "Generate Plan" to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MealPlanner;
