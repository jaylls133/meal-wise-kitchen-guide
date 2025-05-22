
import { MealPlan, Recipe, RecipeSearchResult } from "@/types/recipe";

// This is for demo purposes only. In a real app, you would use environment variables
// or a secure way to store API keys, like Supabase Secrets if deploying with Supabase.
const API_KEY = "YOUR_SPOONACULAR_API_KEY";
const BASE_URL = "https://api.spoonacular.com";

// For now, we'll use dummy data for development
const useDummyData = true;

export async function getRandomRecipes(number: number = 6) {
  if (useDummyData) {
    const dummyData = await import("../data/randomRecipes.json");
    return dummyData.recipes;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/recipes/random?number=${number}&apiKey=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch random recipes");
    }
    const data = await response.json();
    return data.recipes;
  } catch (error) {
    console.error("Error fetching random recipes:", error);
    throw error;
  }
}

export async function searchRecipes(params: Record<string, any>): Promise<RecipeSearchResult> {
  if (useDummyData) {
    const dummyData = await import("../data/searchResults.json");
    return dummyData.default;
  }

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value.toString());
    }
  });
  queryParams.append("apiKey", API_KEY);

  try {
    const response = await fetch(`${BASE_URL}/recipes/complexSearch?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to search recipes");
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching recipes:", error);
    throw error;
  }
}

export async function getRecipeById(id: number): Promise<Recipe> {
  if (useDummyData) {
    const dummyData = await import("../data/recipeDetails.json");
    return dummyData.default;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=true`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch recipe details for ID: ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    throw error;
  }
}

export async function generateMealPlan(params: Record<string, any>): Promise<MealPlan> {
  if (useDummyData) {
    const dummyData = await import("../data/mealPlan.json");
    return dummyData.default;
  }

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value.toString());
    }
  });
  queryParams.append("apiKey", API_KEY);

  try {
    const response = await fetch(
      `${BASE_URL}/mealplanner/generate?${queryParams.toString()}`
    );
    if (!response.ok) {
      throw new Error("Failed to generate meal plan");
    }
    return await response.json();
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
}

export async function findRecipesByIngredients(ingredients: string, number: number = 5) {
  if (useDummyData) {
    const dummyData = await import("../data/ingredientSearch.json");
    return dummyData.default;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/recipes/findByIngredients?ingredients=${ingredients}&number=${number}&apiKey=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Failed to find recipes by ingredients");
    }
    return await response.json();
  } catch (error) {
    console.error("Error finding recipes by ingredients:", error);
    throw error;
  }
}

export async function autoCompleteIngredient(query: string) {
  if (useDummyData) {
    return [
      { name: "apple", image: "apple.jpg" },
      { name: "banana", image: "banana.jpg" },
      { name: "carrot", image: "carrot.jpg" },
    ];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/food/ingredients/autocomplete?query=${query}&apiKey=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Failed to autocomplete ingredient");
    }
    return await response.json();
  } catch (error) {
    console.error("Error autocompleting ingredient:", error);
    throw error;
  }
}

export async function getIngredientInformation(id: number) {
  if (useDummyData) {
    const dummyData = await import("../data/ingredientInfo.json");
    return dummyData.default;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/food/ingredients/${id}/information?apiKey=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Failed to get ingredient information for ID: ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting ingredient information:", error);
    throw error;
  }
}
