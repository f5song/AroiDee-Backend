import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const saveRecipe = async (req: Request, res: Response) => {
    try {
      const { user_id, recipe_id } = req.body;
  
      // ตรวจสอบว่ามีการบันทึกสูตรนี้ไปแล้วหรือไม่
      const existing = await prisma.saved_recipes.findUnique({
        where: {
          user_id_recipe_id: { user_id, recipe_id },
        },
      });
  
      if (existing) {
        return res.status(400).json({ success: false, message: "Recipe already saved" });
      }
  
      const saved = await prisma.saved_recipes.create({
        data: { user_id, recipe_id },
      });
  
      res.json({ success: true, saved });
    } catch (error) {
      console.error("Error saving recipe:", error);
      res.status(500).json({ success: false, message: "Failed to save recipe" });
    }
  };
  

  export const unsaveRecipe = async (req: Request, res: Response) => {
    try {
      const { user_id, recipe_id } = req.body;
  
      await prisma.saved_recipes.delete({
        where: {
          user_id_recipe_id: { user_id, recipe_id },
        },
      });
  
      res.json({ success: true, message: "Recipe unsaved successfully" });
    } catch (error) {
      console.error("Error unsaving recipe:", error);
      res.status(500).json({ success: false, message: "Failed to unsave recipe" });
    }
  };
  

  export const getSavedRecipes = async (req: Request, res: Response) => {
    try {
      const { user_id } = req.params;
  
      const savedRecipes = await prisma.saved_recipes.findMany({
        where: { user_id: Number(user_id) },
        include: { recipes: true }, // ✅ เปลี่ยน `recipe` → `recipes`
      });
  
      res.json({ success: true, savedRecipes });
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
      res.status(500).json({ success: false, message: "Failed to fetch saved recipes" });
    }
  };
  
