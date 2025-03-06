// components/myRecipe/PageHeader.tsx
import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export interface RecipeStatsProps {
  recipeCount: number;
  activeTab: string;
}

/**
 * Page header component for My Recipes page
 */
const PageHeader: React.FC<{ stats?: RecipeStatsProps }> = ({ stats }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/recipe/create');
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          👨‍🍳 My Recipe Collection
        </h1>
        {stats ? (
          <RecipeStats recipeCount={stats.recipeCount} activeTab={stats.activeTab} />
        ) : (
          <p className="text-gray-500">
            Manage your personal recipes and favorites
          </p>
        )}
      </div>

      <div className="mt-4 md:mt-0">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleClick}>
          <PlusCircle className="w-4 h-4 mr-2" /> Create New Recipe
        </Button>
      </div>
    </div>
  );
};

/**
 * Recipe stats component
 */
export function RecipeStats({ recipeCount, activeTab }: RecipeStatsProps) {
  const recipeType = activeTab === "myRecipes" ? "personal" : "saved";
  
  if (recipeCount === 0) {
    return (
      <p className="text-gray-500">
        No {recipeType} recipes yet
      </p>
    );
  }
  
  return (
    <p className="text-gray-500">
      You have {recipeCount} {recipeType} recipes
    </p>
  );
}

export default PageHeader;