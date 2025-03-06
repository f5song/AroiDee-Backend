import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BarChart, Star, Heart } from "lucide-react";
import AdvancedLazyImage from "@/components/homepage/AdvancedLazyImage";

export interface Recipe {
  id: string;
  title: string;
  author: string;
  image: string;
  cookTime: string;
  calories: number;
  rating: number;
  ingredients: string[];
  isFavorite: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite: (id: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onToggleFavorite }) => {
  // Memoize callback to prevent unnecessary re-renders
  const handleToggleFavorite = React.useCallback(() => {
    onToggleFavorite(recipe.id);
  }, [onToggleFavorite, recipe.id]);

  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col min-h-[420px]">
      {/* Recipe Image with lazy loading */}
      <div className="w-full h-48">
        <AdvancedLazyImage 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-full" 
          objectFit="cover"
          rootMargin="200px 0px" // เริ่มโหลดก่อนที่รูปจะเข้ามาในหน้าจอ 200px
        />
      </div>

      {/* Recipe Details */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h4 className="font-semibold text-lg mb-1 line-clamp-1">{recipe.title}</h4>
          <p className="text-sm text-gray-500 mb-2 line-clamp-1">by {recipe.author}</p>

          {/* Ingredients (Fixed Height) */}
          <div className="flex flex-wrap gap-2 my-2 max-h-[40px] overflow-hidden">
            {recipe.ingredients.slice(0, 3).map((ing, i) => (
              <Badge key={i} variant="outline" className="bg-green-50">{ing}</Badge>
            ))}
            {recipe.ingredients.length > 3 && (
              <Badge variant="outline">+{recipe.ingredients.length - 3}</Badge>
            )}
          </div>
        </div>

        {/* Cook Time & Calories */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" aria-hidden="true" /> 
            <span>{recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="h-4 w-4" aria-hidden="true" /> 
            <span>{recipe.calories} kcal</span>
          </div>
        </div>

        {/* Rating & Favorite Button */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-1 text-yellow-500" aria-label={`Rating: ${recipe.rating} out of 5`}>
            <Star className="h-5 w-5" aria-hidden="true" /> 
            <span>{recipe.rating}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleToggleFavorite}
            aria-label={recipe.isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={recipe.isFavorite}
          >
            <Heart 
              className={`h-5 w-5 ${recipe.isFavorite ? "fill-red-500 text-red-500" : ""}`} 
              aria-hidden="true"
            />
            <span className="ml-1">{recipe.isFavorite ? "Liked" : "Like"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Memo to prevent unnecessary re-renders
export default memo(RecipeCard);