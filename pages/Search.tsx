
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { SearchBar } from "@/components/SearchBar";
import { RecipeCard } from "@/components/RecipeCard";
import { searchRecipes } from "@/services/api";
import { RecipeSearchItem, SearchParams } from "@/types/recipe";
import { Skeleton } from "@/components/ui/skeleton";

const cuisines = ["Any", "Italian", "Mexican", "Asian", "American", "Mediterranean", "Indian", "French"];
const diets = ["Any", "Vegetarian", "Vegan", "Gluten Free", "Ketogenic", "Paleo"];
const intolerances = ["Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Soy", "Wheat"];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<RecipeSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  
  // Filter states
  const [cuisine, setCuisine] = useState<string>(searchParams.get("cuisine") || "Any");
  const [diet, setDiet] = useState<string>(searchParams.get("diet") || "Any");
  const [selectedIntolerances, setSelectedIntolerances] = useState<string[]>(
    searchParams.get("intolerances") ? searchParams.get("intolerances")!.split(",") : []
  );
  const [maxReadyTime, setMaxReadyTime] = useState<number | undefined>(
    searchParams.get("maxReadyTime") ? parseInt(searchParams.get("maxReadyTime")!) : undefined
  );

  const query = searchParams.get("query") || "";

  // Handle search with current filters
  const performSearch = async () => {
    if (!query && cuisine === "Any" && diet === "Any" && selectedIntolerances.length === 0 && !maxReadyTime) {
      return;
    }
    
    const params: SearchParams = {
      query: query || undefined,
      cuisine: cuisine !== "Any" ? cuisine : undefined,
      diet: diet !== "Any" ? diet.toLowerCase() : undefined,
      intolerances: selectedIntolerances.length > 0 ? selectedIntolerances.join(",") : undefined,
      maxReadyTime,
      number: 12
    };
    
    setLoading(true);
    
    try {
      const data = await searchRecipes(params);
      setResults(data.results);
      setTotalResults(data.totalResults);
    } catch (error) {
      console.error("Error performing search:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial search on mount or when URL params change
  useEffect(() => {
    if (query || cuisine !== "Any" || diet !== "Any" || selectedIntolerances.length > 0 || maxReadyTime) {
      performSearch();
    }
  }, [searchParams]);
  
  // Update URL when filters change
  const updateFilters = () => {
    const newParams: Record<string, string> = {};
    
    if (query) newParams.query = query;
    if (cuisine !== "Any") newParams.cuisine = cuisine;
    if (diet !== "Any") newParams.diet = diet;
    if (selectedIntolerances.length > 0) newParams.intolerances = selectedIntolerances.join(",");
    if (maxReadyTime) newParams.maxReadyTime = maxReadyTime.toString();
    
    setSearchParams(newParams);
  };
  
  // Toggle intolerance selection
  const toggleIntolerance = (intolerance: string) => {
    setSelectedIntolerances(prev => 
      prev.includes(intolerance)
        ? prev.filter(i => i !== intolerance)
        : [...prev, intolerance]
    );
  };

  return (
    <MainLayout>
      <div className="container-custom py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Find Recipes</h1>
        
        <div className="mb-8">
          <SearchBar 
            placeholder="Search for recipes (e.g. pasta, vegan dinner, etc.)" 
            onSearch={(q) => setSearchParams({ ...Object.fromEntries(searchParams.entries()), query: q })}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6">Filters</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Cuisine</label>
                <select
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full p-2 border border-neutral-200 rounded-md"
                >
                  {cuisines.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Diet</label>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-full p-2 border border-neutral-200 rounded-md"
                >
                  {diets.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Max Ready Time (minutes)</label>
                <input
                  type="number"
                  value={maxReadyTime || ""}
                  onChange={(e) => setMaxReadyTime(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Any time"
                  min="5"
                  className="w-full p-2 border border-neutral-200 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Intolerances</label>
                <div className="space-y-2">
                  {intolerances.map((intolerance) => (
                    <div key={intolerance} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`intolerance-${intolerance}`}
                        checked={selectedIntolerances.includes(intolerance)}
                        onChange={() => toggleIntolerance(intolerance)}
                        className="mr-2"
                      />
                      <label htmlFor={`intolerance-${intolerance}`} className="text-sm text-neutral-700">
                        {intolerance}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={updateFilters}
                className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Results */}
          <div className="md:col-span-3">
            {query || cuisine !== "Any" || diet !== "Any" || selectedIntolerances.length > 0 || maxReadyTime ? (
              <div className="mb-6">
                <h2 className="text-xl font-bold">
                  {loading ? "Searching..." : `${totalResults} Results`}
                </h2>
                {query && (
                  <p className="text-neutral-600">
                    Search for: "{query}"
                  </p>
                )}
              </div>
            ) : (
              <div className="mb-6">
                <h2 className="text-xl font-bold">Popular Recipes</h2>
                <p className="text-neutral-600">
                  Use filters to refine your search
                </p>
              </div>
            )}
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="recipe-card">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {results.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="bg-neutral-50 p-8 rounded-xl text-center">
                <h3 className="text-xl font-medium mb-2">No recipes found</h3>
                <p className="text-neutral-600">
                  Try adjusting your search terms or filters to find more recipes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Search;
