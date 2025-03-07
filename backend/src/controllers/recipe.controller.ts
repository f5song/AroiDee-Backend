import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ POST /api/recipes - สร้างสูตรอาหารใหม่
export const createRecipe = async (req: Request, res: Response) => {
  try {
    const newRecipe = await prisma.recipes.create({
      data: req.body, // ตรวจสอบให้แน่ใจว่า req.body มีค่าที่ถูกต้อง
    });

    res.status(201).json({ success: true, data: newRecipe });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error creating recipe", error: error.message });
  }
};

// ✅ GET /api/recipes - ดึงรายการสูตรอาหารทั้งหมด
export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipes.findMany({
      include: {
        user: {
          select: { username: true },
        },
        recipe_categories: {
          include: {
            category: {
              select: { name: true },
            },
          },
        },
        recipe_ingredients: {
          include: { ingredients: { select: { name: true } } }, // ✅ ใช้ select ภายใน include
        },
        nutrition_facts: {
          select: { calories: true },
        },
      },
    });

    // ✅ แปลงข้อมูลให้ frontend ใช้ได้ง่าย
    const formattedRecipes = recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      author: recipe.user?.username || "Unknown",
      image_url: recipe.image_url || "/default-recipe.jpg",
      cook_time: recipe.cook_time || 0,
      calories: recipe.nutrition_facts?.[0]?.calories
        ? Number(recipe.nutrition_facts[0].calories)
        : 0,
      rating: recipe.rating ?? 0, // ✅ เพิ่มค่า rating

      categories:
        recipe.recipe_categories?.map((rc) => rc.category.name) || [],
      ingredients:
        recipe.recipe_ingredients?.map((ri) => ri.ingredients?.name || "Unknown") || [],
    }));

    res.json({ success: true, data: formattedRecipes });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ success: false, message: "Failed to fetch recipes" });
  }
};



// ✅ GET /api/recipes/:id - ดึงรายละเอียดสูตรอาหารตาม ID
export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const recipeId = Number(req.params.id);
    if (isNaN(recipeId)) {
      return res.status(400).json({ success: false, message: "Invalid recipe ID" });
    }

    const recipe = await prisma.recipes.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    res.status(200).json({ success: true, data: recipe });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching recipe", error: error.message });
  }
};

// ✅ GET /api/recipes/search?title=...&category=...&ingredient=...
export const searchRecipes = async (req: Request, res: Response) => {
  try {
    const filters: any = {};

    if (req.query.title) {
      filters.title = { contains: String(req.query.title), mode: "insensitive" };
    }
    if (req.query.category) {
      filters.category_id = Number(req.query.category);
    }
    if (req.query.ingredient) {
      filters.recipe_ingredients = {
        some: {
          ingredients: {
            name: { contains: String(req.query.ingredient), mode: "insensitive" },
          },
        },
      };
    }

    const recipes = await prisma.recipes.findMany({
      where: filters,
      include: {
        categories: true,
        recipe_ingredients: {
          include: {
            ingredients: true,
          },
        },
      },
    });

    res.json({ success: true, data: recipes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error searching recipes", error: error.message });
  }
};

// ✅ PUT /api/recipes/:id - อัปเดตข้อมูลสูตรอาหาร
export const updateRecipe = async (req: Request, res: Response) => {
  try {
    const updatedRecipe = await prisma.recipes.update({
      where: { id: Number(req.params.id) },
      data: req.body, // ตรวจสอบให้แน่ใจว่ามีค่าที่จะอัปเดต
    });

    res.json({ success: true, data: updatedRecipe });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error updating recipe", error: error.message });
  }
};

// ✅ DELETE /api/recipes/:id - ลบสูตรอาหาร
export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    await prisma.recipes.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ success: true, message: "Recipe deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error deleting recipe", error: error.message });
  }
};
