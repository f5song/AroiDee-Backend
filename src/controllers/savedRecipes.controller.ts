import { Request, Response } from "express";  // ตรวจสอบว่าใช้ express types ที่ถูกต้อง
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ API บันทึกสูตรอาหารลงฐานข้อมูล
export const saveRecipe = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user_id, recipe_id } = req.body;

    console.log("📌 [SAVE] Request received:", { user_id, recipe_id });

    if (!user_id || !recipe_id) {
      return res.status(400).json({ success: false, message: "Missing user_id or recipe_id" });
    }

    const existing = await prisma.saved_recipes.findFirst({
      where: { user_id, recipe_id },
    });

    if (existing) {
      console.log("⚠️ [SAVE] Recipe already saved:", existing);
      return res.status(400).json({ success: false, message: "Recipe already saved" });
    }

    const saved = await prisma.saved_recipes.create({
      data: { user_id, recipe_id },
    });

    console.log("✅ [SAVE] Recipe saved successfully:", saved);
    return res.json({ success: true, saved });
  } catch (error) {
    console.error("❌ [SAVE] Error saving recipe:", error);
    return res.status(500).json({ success: false, message: "Failed to save recipe" });
  }
};


export const unsaveRecipe = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user_id, recipe_id } = req.body;

    console.log("📌 [UNSAVE] Request received:", { user_id, recipe_id });

    if (!user_id || !recipe_id) {
      return res.status(400).json({ success: false, message: "Missing user_id or recipe_id" });
    }

    const existing = await prisma.saved_recipes.findFirst({
      where: { user_id, recipe_id },
    });

    if (!existing) {
      console.log("⚠️ [UNSAVE] Recipe not found:", { user_id, recipe_id });
      return res.status(404).json({ success: false, message: "Recipe not found in saved list" });
    }

    await prisma.saved_recipes.deleteMany({
      where: { user_id, recipe_id },
    });

    console.log("✅ [UNSAVE] Recipe unsaved successfully:", { user_id, recipe_id });
    return res.json({ success: true, message: "Recipe unsaved successfully" });
  } catch (error) {
    console.error("❌ [UNSAVE] Error unsaving recipe:", error);
    return res.status(500).json({ success: false, message: "Failed to unsave recipe" });
  }
};




// ✅ API ดึงรายการสูตรอาหารที่ผู้ใช้บันทึก
export const getSavedRecipes = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ success: false, message: "Missing user_id" });
    }

    const savedRecipes = await prisma.saved_recipes.findMany({
      where: { user_id: Number(user_id) },
      include: {
        recipes: {
          select: {
            id: true,
            title: true,
            image_url: true,
            cook_time: true,
            rating: true,
          },
        },
      },
    });

    // ✅ แปลงข้อมูลให้ส่งไป frontend ได้ถูกต้อง
    const formattedSavedRecipes = savedRecipes.map((saved) => ({
      recipe_id: saved.recipes?.id ?? 0,
      title: saved.recipes?.title ?? "Unknown Title",
      image_url: saved.recipes?.image_url ?? "/default-recipe.jpg",
      cook_time: saved.recipes?.cook_time ?? 0,
      rating: saved.recipes?.rating ?? 0,
    }));

    return res.json({ success: true, savedRecipes: formattedSavedRecipes });
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch saved recipes" });
  }
};
