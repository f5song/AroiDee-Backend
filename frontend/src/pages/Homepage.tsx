import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import AuthDemoComponent from "@/components/auth/AuthDemoComponent";
import Hero from "@/components/homepage/Hero";
import Categories from "@/components/homepage/Categories";
import Content from "@/components/homepage/Content";
import ShareRecipe from "@/components/homepage/ShareRecipe"; 
import RecipeGrid, { RecipeItem } from "@/components/homepage/RecipeGrid";
import useResourcePreloader from "@/lib/hooks/useResourcePreloader";

// Recipe data for the carousel components
const recipesData = [
  {
    id: "1",
    title: "Oatmeal Pancakes",
    author: "Sarah Johnson",
    image: "/placeholder.svg",
    cookTime: "20 mins",
    calories: 320,
    rating: 4.8,
    ingredients: ["Oats", "Milk", "Egg", "Honey"],
    isFavorite: true
  },
  {
    id: "2",
    title: "Herb Roasted Chicken",
    author: "Jane Doe",
    image: "/placeholder.svg",
    cookTime: "60 mins",
    calories: 450,
    rating: 4.5,
    ingredients: ["Chicken", "Basil", "Garlic", "Pepper", "Olive Oil"],
    isFavorite: false
  },
  {
    id: "3",
    title: "Mixed Vegetable Salad",
    author: "Mike Wilson",
    image: "/placeholder.svg",
    cookTime: "15 mins",
    calories: 180,
    rating: 4.2,
    ingredients: ["Salad Greens", "Tomato", "Cucumber", "Avocado"],
    isFavorite: false
  },
  {
    id: "4",
    title: "Berry Smoothie",
    author: "Emily Clark",
    image: "/placeholder.svg",
    cookTime: "10 mins",
    calories: 150,
    rating: 4.7,
    ingredients: ["Strawberries", "Blueberries", "Yogurt"],
    isFavorite: true
  },
  {
    id: "5",
    title: "Pumpkin Soup",
    author: "Emily Clark",
    image: "/placeholder.svg",
    cookTime: "25 mins",
    calories: 180,
    rating: 4.6,
    ingredients: ["Pumpkin", "Onion", "Cream", "Vegetable Stock"],
    isFavorite: true
  },
  {
    id: "6",
    title: "Chicken Curry",
    author: "Alex Chen",
    image: "/placeholder.svg",
    cookTime: "40 mins",
    calories: 380,
    rating: 4.9,
    ingredients: ["Chicken", "Curry Paste", "Coconut Milk", "Rice"],
    isFavorite: true
  },
  {
    id: "7",
    title: "Avocado Toast",
    author: "Lisa Brown",
    image: "/placeholder.svg",
    cookTime: "10 mins",
    calories: 220,
    rating: 4.3,
    ingredients: ["Bread", "Avocado", "Lime", "Chili Flakes"],
    isFavorite: true
  },
  {
    id: "8",
    title: "Chocolate Brownies",
    author: "Mark Johnson",
    image: "/placeholder.svg",
    cookTime: "35 mins",
    calories: 300,
    rating: 4.8,
    ingredients: ["Chocolate", "Butter", "Eggs", "Flour", "Sugar"],
    isFavorite: true
  }
];

// Featured recipes data (Super Delicious)
const featuredRecipes: RecipeItem[] = [
  {
    id: 1,
    title: "Delicious Fancy Glazed Blueberry Donuts",
    image: "/api/placeholder/400/300",
    author: "Tricia Albert",
    rating: 5,
    timePosted: "Yesterday",
    views: 458
  },
  {
    id: 2,
    title: "Pan Fried Cod in Creamy Kale Sauce",
    image: "/api/placeholder/400/300",
    author: "Tricia Albert",
    rating: 5,
    timePosted: "Yesterday",
    views: 458
  },
  {
    id: 3,
    title: "Berry Maddiness Biscuits",
    image: "/api/placeholder/400/300",
    author: "Tricia Albert",
    rating: 5,
    timePosted: "Yesterday",
    views: 436
  },
  {
    id: 4,
    title: "Four Ingredient Oatmeal Pancakes",
    image: "/api/placeholder/400/300",
    author: "Tricia Albert",
    rating: 5,
    timePosted: "Yesterday",
    views: 456
  },
  {
    id: 5,
    title: "Pumpkin Marshmallow Pie and Nuts",
    image: "/api/placeholder/400/300",
    author: "Tricia Albert",
    rating: 5,
    timePosted: "Yesterday",
    views: 458
  },
  {
    id: 6,
    title: "Mighty Cheesy Breakfast Burger",
    image: "/api/placeholder/400/300",
    author: "Tricia Albert",
    rating: 5,
    timePosted: "Yesterday",
    views: 438
  }
];

// Latest recipes data
const latestRecipes: RecipeItem[] = [
  {
    id: 1,
    title: "Caramel Strawberry Milkshake",
    image: "/api/placeholder/300/200"
  },
  {
    id: 2,
    title: "Cashew Vegan Rice",
    image: "/api/placeholder/300/200"
  },
  {
    id: 3,
    title: "Smoked Salmon Salad Sandwich",
    image: "/api/placeholder/300/200"
  },
  {
    id: 4,
    title: "Salmon in Creamy Sun Dried Tomato Sauce",
    image: "/api/placeholder/300/200"
  },
  {
    id: 5,
    title: "Healthy Jam Waffle Breakfast",
    image: "/api/placeholder/300/200"
  },
  {
    id: 6,
    title: "Chocolate and Banana Jar Cake",
    image: "/api/placeholder/300/200"
  },
  {
    id: 7,
    title: "Caramel Blueberry Scones",
    image: "/api/placeholder/300/200"
  },
  {
    id: 8,
    title: "Blueberry Carrot Cake",
    image: "/api/placeholder/300/200"
  },
  {
    id: 9,
    title: "Vegan Cauliflower Salad",
    image: "/api/placeholder/300/200"
  },
  {
    id: 10,
    title: "Roasted Red Pepper Soup",
    image: "/api/placeholder/300/200"
  },
  {
    id: 11,
    title: "Eggs and Avocado Toast",
    image: "/api/placeholder/300/200"
  },
  {
    id: 12,
    title: "Pork Shoulder Cashew Noodles",
    image: "/api/placeholder/300/200"
  }
];

const Homepage: React.FC = () => {
  const [recipes, setRecipes] = useState(recipesData);
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Define critical resources that should be loaded immediately
  const criticalResources = [
    { src: "Apples.jpg", type: 'image' as const }, // Hero image
    // You can add more critical resources here
  ];

  // Use resource preloader for critical assets
  const { loaded, progress } = useResourcePreloader(criticalResources, {
    priority: 'high',
    imageLoadStrategy: 'eager'
  });

  // Set loading state based on critical resources
  useEffect(() => {
    if (loaded) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  const toggleFavorite = (id: string) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
      )
    );
  };

  const handleLoadMore = () => {
    console.log("Loading more recipes...");
    // Implement loading logic here
  };

  // Loading screen for critical resources
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mb-4 mx-auto"></div>
          <p className="text-lg text-gray-700">Loading recipe data... {progress}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />
      
      <main className="container mx-auto py-6 px-4">
        {/* Dev Authentication Demo - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Authentication Test</h2>
            <p className="text-gray-600 mb-4">
              Use the buttons below to toggle between login and logout states to test the Navbar display
            </p>
            <AuthDemoComponent />
          </div>
        )}
        
        {/* Popular Categories */}
        <Categories />
        
        {/* Featured Recipes (Super Delicious Section) */}
        <RecipeGrid 
          title="Super Delicious" 
          recipes={featuredRecipes} 
          variant="featured" 
        />
        
        {/* Recommended Recipes */}
        <Content topic="Recommended" recipes={recipes} toggleFavorite={toggleFavorite} />
        
        {/* Most Popular Recipes */}
        <Content topic="Most Popular Recipes" recipes={recipes} toggleFavorite={toggleFavorite} />
        
        {/* Latest Recipes Grid */}
        <RecipeGrid 
          title="Latest Recipes" 
          recipes={latestRecipes} 
          variant="latest" 
          showLoadMore={true}
          onLoadMore={handleLoadMore}
        />

        {/* Share Recipe - only shown to authenticated users */}
        {isAuthenticated && <ShareRecipe />}
      </main>
    </div>
  );
};

export default Homepage;