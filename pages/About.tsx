
import { MainLayout } from "@/layouts/MainLayout";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const About = () => {
  return (
    <MainLayout>
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">About FoodGenius</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-lg">
              FoodGenius is your smart companion for discovering recipes, planning meals, and making the most of your ingredients.
              Our goal is to make cooking at home easier, more enjoyable, and accessible to everyone.
            </p>
            
            <h2 className="text-2xl font-bold">Our Features</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">Recipe Search</h3>
                  <p>Find recipes based on ingredients, dietary preferences, cuisine types, and more.</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-bold text-lg">Meal Planning</h3>
                  <p>Generate custom meal plans based on your caloric needs and dietary preferences.</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-bold text-lg">Ingredient-Based Search</h3>
                  <p>Find recipes using ingredients you already have in your kitchen.</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-bold text-lg">Nutrition Information</h3>
                  <p>Access detailed nutritional data for recipes and individual ingredients.</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-bold text-lg">Favorites</h3>
                  <p>Save your favorite recipes for quick access later.</p>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold">Data Source</h2>
            <p>
              Recipe and nutritional data is provided by the Spoonacular API, one of the leading sources of culinary information.
              The information provided should be considered approximate and may vary based on specific brands and preparation methods.
            </p>
            
            <h2 className="text-2xl font-bold">Tips for Using FoodGenius</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Specific searches work best</strong> - Try searching for specific dishes or ingredients rather than broad categories.
              </li>
              <li>
                <strong>Combine filters</strong> - Use diet types, cuisines, and other filters together for more targeted results.
              </li>
              <li>
                <strong>Save favorites</strong> - When you find recipes you love, save them to your favorites for easy access.
              </li>
              <li>
                <strong>Meal planning</strong> - Use the meal planner to help organize your weekly cooking and shopping.
              </li>
            </ul>
            
            <div className="bg-primary-50 p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Get Started</h2>
              <p className="mb-4">
                Ready to start exploring recipes and planning your meals? Check out these key features:
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/search"
                  className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-600 transition-colors"
                >
                  Search Recipes
                </Link>
                <Link
                  to="/meal-planner"
                  className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-600 transition-colors"
                >
                  Meal Planner
                </Link>
                <Link
                  to="/ingredients"
                  className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-600 transition-colors"
                >
                  Ingredients Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
