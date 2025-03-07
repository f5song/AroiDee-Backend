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

// ✅ GET /api/recipes - ดึงรายการสูตรอาหารทั้งหมด พร้อมรองรับ `sort`
// ✅ GET /api/recipes - รองรับ sort=calories-low และ calories-high
export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    const { sort } = req.query;
    let orderBy: any = { created_at: "desc" }; // ค่าเริ่มต้น: ใหม่ไปเก่า
    let recipeIds: number[] | undefined = undefined; // ใช้เก็บลำดับ ID ของ recipes

    if (sort === "oldest") orderBy = { created_at: "asc" };
    if (sort === "rating") orderBy = { rating: "desc" };
    if (sort === "cooking-time") orderBy = { cook_time: "asc" };
    if (sort === "name-asc") orderBy = { title: "asc" };
    if (sort === "name-desc") orderBy = { title: "desc" };

    // 🔹 ถ้าเป็น sort ตาม calories ต้องใช้ query แยกต่างหาก
    if (sort === "calories-low" || sort === "calories-high") {
      const sortOrder = sort === "calories-low" ? "asc" : "desc";

      // ✅ Query เฉพาะ ID ของ recipes ที่เรียงตาม calories
      const sortedRecipes = await prisma.nutrition_facts.findMany({
        select: { recipe_id: true },
        orderBy: { calories: sortOrder },
        take: 50, // ✅ จำกัดจำนวน (ป้องกัน Timeout)
      });

      // ✅ กรองค่า null ออกจาก recipe_id
      recipeIds = sortedRecipes.map((r) => r.recipe_id).filter((id): id is number => id !== null);
    }

    // ✅ Query สูตรอาหาร พร้อม sort ตาม ID ที่เรียงจาก nutrition_facts
    const recipes = await prisma.recipes.findMany({
      where: recipeIds ? { id: { in: recipeIds } } : undefined, // ใช้ ID ที่เรียงมาแล้ว
      include: {
        user: { select: { username: true } },
        recipe_categories: { include: { category: { select: { name: true } } } },
        recipe_ingredients: { include: { ingredients: { select: { name: true } } } },
        nutrition_facts: { select: { calories: true } },
      },
      orderBy: recipeIds ? undefined : orderBy, // ถ้ามี recipeIds แล้ว ไม่ต้องใช้ orderBy
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
      rating: recipe.rating ?? 0,
      categories: recipe.recipe_categories?.map((rc) => rc.category.name) || [],
      ingredients: recipe.recipe_ingredients?.map((ri) => ri.ingredients?.name || "Unknown") || [],
    }));

    res.json({ success: true, data: formattedRecipes });
  } catch (error) {
    console.error("❌ Error fetching recipes:", error);
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
