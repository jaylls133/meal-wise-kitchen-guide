
import { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { autoCompleteIngredient, getIngredientInformation } from "@/services/api";
import { NutritionInfo } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Ingredient {
  id: number;
  name: string;
  image?: string;
}

interface IngredientDetails {
  id: number;
  name: string;
  amount: number;
  unit: string;
  nutrients: NutritionInfo[];
}

const Nutrition = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const results = await autoCompleteIngredient(query);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error searching ingredients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIngredient = async (ingredient: Ingredient) => {
    setShowSuggestions(false);
    setLoading(true);
    
    try {
      const details = await getIngredientInformation(ingredient.id);
      setSelectedIngredient(details);
    } catch (error) {
      console.error("Error getting ingredient details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNutrientValue = (name: string) => {
    if (!selectedIngredient) return null;
    
    const nutrient = selectedIngredient.nutrients.find(
      (n) => n.name.toLowerCase() === name.toLowerCase()
    );
    
    return nutrient;
  };

  return (
    <MainLayout>
      <div className="container-custom py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Nutrition Information</h1>
        <p className="text-neutral-600 mb-8">
          Search for any food to see detailed nutritional information.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Search Panel */}
          <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6">Search Food</h2>
            
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Ingredient Name
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., banana, chicken, rice"
                    className="flex-1 p-3 border border-neutral-200 rounded-l-md"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={loading || !query.trim()}
                    className="rounded-l-none"
                  >
                    Search
                  </Button>
                </div>
                
                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-neutral-200 rounded-md mt-1 shadow-lg">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        className="w-full text-left p-3 hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0"
                        onClick={() => handleSelectIngredient(suggestion)}
                      >
                        {suggestion.name}
                      </button>
                    ))}
                  </div>
                )}
                
                {loading && <p className="mt-2 text-sm text-neutral-500">Loading...</p>}
                
                {showSuggestions && suggestions.length === 0 && !loading && (
                  <p className="mt-2 text-sm text-neutral-500">
                    No ingredients found. Try a different search term.
                  </p>
                )}
              </div>
              
              <div>
                <p className="text-sm text-neutral-500">
                  Search for an ingredient to see its nutritional value. Results show approximate values per serving.
                </p>
              </div>
            </div>
          </div>
          
          {/* Nutrition Info */}
          <div className="md:col-span-2">
            {selectedIngredient ? (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold mb-2 capitalize">
                  {selectedIngredient.name}
                </h2>
                <p className="text-neutral-600 mb-6">
                  Nutritional information for {selectedIngredient.amount} {selectedIngredient.unit}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Main nutrients */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Calories</span>
                        <span className="font-bold">
                          {getNutrientValue('calories')?.amount || 0} kcal
                        </span>
                      </div>
                      <Progress value={getNutrientValue('calories')?.percentOfDailyNeeds || 0} className="h-2" />
                      <p className="text-xs text-neutral-500 mt-1">
                        {Math.round(getNutrientValue('calories')?.percentOfDailyNeeds || 0)}% of daily needs
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Carbohydrates</span>
                        <span className="font-bold">
                          {getNutrientValue('carbohydrates')?.amount || 0}g
                        </span>
                      </div>
                      <Progress value={getNutrientValue('carbohydrates')?.percentOfDailyNeeds || 0} className="h-2" />
                      <p className="text-xs text-neutral-500 mt-1">
                        {Math.round(getNutrientValue('carbohydrates')?.percentOfDailyNeeds || 0)}% of daily needs
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Protein</span>
                        <span className="font-bold">
                          {getNutrientValue('protein')?.amount || 0}g
                        </span>
                      </div>
                      <Progress value={getNutrientValue('protein')?.percentOfDailyNeeds || 0} className="h-2" />
                      <p className="text-xs text-neutral-500 mt-1">
                        {Math.round(getNutrientValue('protein')?.percentOfDailyNeeds || 0)}% of daily needs
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Fat</span>
                        <span className="font-bold">
                          {getNutrientValue('fat')?.amount || 0}g
                        </span>
                      </div>
                      <Progress value={getNutrientValue('fat')?.percentOfDailyNeeds || 0} className="h-2" />
                      <p className="text-xs text-neutral-500 mt-1">
                        {Math.round(getNutrientValue('fat')?.percentOfDailyNeeds || 0)}% of daily needs
                      </p>
                    </div>
                  </div>
                  
                  {/* Additional nutrients */}
                  <div>
                    <h3 className="font-bold text-lg mb-4">Additional Nutrients</h3>
                    <div className="space-y-3">
                      {['Fiber', 'Sugar', 'Vitamin C', 'Vitamin D', 'Calcium', 'Iron', 'Potassium'].map((name) => {
                        const nutrient = getNutrientValue(name);
                        if (!nutrient || nutrient.amount === 0) return null;
                        
                        return (
                          <div key={name}>
                            <div className="flex justify-between text-sm">
                              <span>{name}</span>
                              <span>
                                {nutrient.amount.toFixed(1)}{nutrient.unit} 
                                <span className="text-neutral-500 ml-1">
                                  ({Math.round(nutrient.percentOfDailyNeeds)}%)
                                </span>
                              </span>
                            </div>
                            <Separator className="mt-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-50 p-8 rounded-xl text-center flex flex-col items-center">
                <div className="bg-primary-100 p-4 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Discover Nutritional Information</h3>
                <p className="text-neutral-600 max-w-md mx-auto">
                  Search for any food to see detailed nutritional content and percentage of daily requirements.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Nutrition;
