
export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-800 text-neutral-200 mt-auto">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">FoodGenius</h3>
            <p className="text-sm text-neutral-300">
              Find, Cook, and Plan Your Meals Smarter. Discover recipes, plan your meals, and make the most of your ingredients.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-sm hover:text-white transition-colors">Home</a></li>
              <li><a href="/search" className="text-sm hover:text-white transition-colors">Recipe Search</a></li>
              <li><a href="/meal-planner" className="text-sm hover:text-white transition-colors">Meal Planner</a></li>
              <li><a href="/about" className="text-sm hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Powered By</h4>
            <p className="text-sm text-neutral-300">
              Recipe data provided by Spoonacular API.
            </p>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-4 text-center text-sm">
          <p>&copy; {currentYear} FoodGenius. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
