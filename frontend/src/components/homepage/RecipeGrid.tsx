import React from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import AdvancedLazyImage from "@/components/homepage/AdvancedLazyImage";

// Recipe item type for both featured and latest recipes
export interface RecipeItem {
  id: number;
  title: string;
  image: string;
  author?: string;
  rating?: number;
  timePosted?: string;
  views?: number;
}

interface RecipeGridProps {
  title: string;
  recipes: RecipeItem[];
  variant: "featured" | "latest";
  showLoadMore?: boolean;
  onLoadMore?: () => void;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ 
  title, 
  recipes, 
  variant, 
  showLoadMore = false,
  onLoadMore = () => {}
}) => {
  return (
    <section className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      
      {variant === "featured" ? (
        // Featured recipes layout (larger cards with more details)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <AdvancedLazyImage 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-48"
                  objectFit="cover"
                />
              </div>
              
              <div className="p-4">
                {/* Rating stars */}
                {recipe.rating && (
                  <div className="flex text-orange-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-orange-500" />
                    ))}
                  </div>
                )}
                
                {/* Recipe title */}
                <h3 className="font-medium text-lg mb-1 line-clamp-2">{recipe.title}</h3>
                
                {/* Author with avatar */}
                {recipe.author && (
                  <div className="flex items-center mt-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden mr-2">
                      <AdvancedLazyImage 
                        src="/api/placeholder/30/30" 
                        alt={recipe.author} 
                        className="w-full h-full"
                        objectFit="cover"
                      />
                    </div>
                    <span className="text-sm text-gray-600">{recipe.author}</span>
                  </div>
                )}
                
                {/* Meta information */}
                {(recipe.timePosted || recipe.views) && (
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    {recipe.timePosted && (
                      <div className="flex items-center">
                        <span className="mr-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                        <span>{recipe.timePosted}</span>
                      </div>
                    )}
                    
                    {recipe.views && (
                      <div className="flex items-center ml-4">
                        <span className="mr-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </span>
                        <span>{recipe.views}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Latest recipes layout (smaller cards in a grid)
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="group cursor-pointer">
              {/* Image Container */}
              <div className="relative overflow-hidden bg-gray-100 mb-2">
                <AdvancedLazyImage 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full aspect-[4/3]"
                  objectFit="cover"
                  aspectRatio="75%" // 4:3 aspect ratio (3/4 = 75%)
                />
              </div>
              
              {/* Recipe Title */}
              <h3 className="text-sm font-medium line-clamp-2">{recipe.title}</h3>
            </div>
          ))}
        </div>
      )}
      
      {/* Load More Button */}
      {showLoadMore && (
        <div className="mt-8 text-center">
          <Button variant="outline" className="border-gray-300 hover:bg-gray-50" onClick={onLoadMore}>
            Load More
          </Button>
        </div>
      )}
    </section>
  );
};

export default RecipeGrid;