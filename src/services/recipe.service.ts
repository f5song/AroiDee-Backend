import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createRecipe = async (data: {
  user_id: number;
  category_id?: number;
  title: string;
  description?: string;
  instructions: string;
  image_url?: string;
}) => {
  return await prisma.recipes.create({ data });
};

export const getAllRecipes = async () => {
  return await prisma.recipes.findMany();
};

export const getRecipeById = async (id: number) => {
  return await prisma.recipes.findUnique({
    where: { id },
    include: { recipe_ingredients: true, nutrition_facts: true },
  });
};

export const searchRecipes = async (filters: { title?: string; category?: number; ingredient?: string }) => {
  return await prisma.recipes.findMany({
    where: {
      title: filters.title ? { contains: filters.title } : undefined,
      category_id: filters.category,
      recipe_ingredients: filters.ingredient
        ? { some: { ingredients: { name: { contains: filters.ingredient } } } }
        : undefined,
    },
  });
};

export const updateRecipe = async (id: number, data: { 
  title?: string;
  description?: string;
  instructions?: string;
  image_url?: string;
  category_id?: number;
}) => {
  return await prisma.recipes.update({ where: { id }, data });
};

export const deleteRecipe = async (id: number) => {
  return await prisma.recipes.delete({ where: { id } });
};
