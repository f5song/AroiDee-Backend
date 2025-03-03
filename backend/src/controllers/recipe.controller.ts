import { Request, Response } from "express";
import * as recipeService from "../services/recipe.service";

// ✅ POST /api/recipes - สร้างสูตรอาหารใหม่
export const createRecipe = async (req: Request, res: Response) => {
  try {
    const newRecipe = await recipeService.createRecipe(req.body);
    res.status(201).json({ success: true, data: newRecipe });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET /api/recipes - ดึงรายการสูตรอาหารทั้งหมด
export const getAllRecipes = async (_req: Request, res: Response) => {
  try {
    const recipes = await recipeService.getAllRecipes();
    res.json({ success: true, data: recipes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET /api/recipes/:id - ดึงรายละเอียดสูตรอาหารตาม ID
export const getRecipeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipeId = Number(req.params.id);
    if (isNaN(recipeId)) {
      res.status(400).json({ success: false, message: "Invalid recipe ID" });
      return;
    }

    const recipe = await recipeService.getRecipeById(recipeId);
    if (!recipe) {
      res.status(404).json({ success: false, message: "Recipe not found" });
      return;
    }

    res.status(200).json({ success: true, data: recipe });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching recipe", error: error.message });
  }
};


// ✅ GET /api/recipes/search?title=...&category=...&ingredient=...
export const searchRecipes = async (req: Request, res: Response) => {
  try {
    const filters = {
      title: req.query.title ? String(req.query.title) : undefined,
      category: req.query.category ? Number(req.query.category) : undefined,
      ingredient: req.query.ingredient ? String(req.query.ingredient) : undefined,
    };

    const recipes = await recipeService.searchRecipes(filters);
    res.json({ success: true, data: recipes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ PUT /api/recipes/:id - อัปเดตข้อมูลสูตรอาหาร
export const updateRecipe = async (req: Request, res: Response) => {
  try {
    const updatedRecipe = await recipeService.updateRecipe(Number(req.params.id), req.body);
    res.json({ success: true, data: updatedRecipe });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE /api/recipes/:id - ลบสูตรอาหาร
export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    await recipeService.deleteRecipe(Number(req.params.id));
    res.json({ success: true, message: "Recipe deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
