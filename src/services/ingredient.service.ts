import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createIngredient = async (name: string, unit: string) => {
  const existingIngredient = await prisma.ingredients.findUnique({ where: { name } });
  if (existingIngredient) throw new Error("Ingredient already exists");

  return await prisma.ingredients.create({ data: { name, unit } });
};

export const getAllIngredients = async () => {
  return await prisma.ingredients.findMany();
};

export const getIngredientById = async (id: number) => {
  const ingredient = await prisma.ingredients.findUnique({ where: { id } });
  if (!ingredient) throw new Error("Ingredient not found");
  return ingredient;
};

export const updateIngredient = async (id: number, name: string, unit: string) => {
  return await prisma.ingredients.update({
    where: { id },
    data: { name, unit },
  });
};

export const deleteIngredient = async (id: number) => {
  return await prisma.ingredients.delete({ where: { id } });
};
