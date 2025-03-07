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

// ✅ GET /api/recipes - รองรับ sort=calories-low และ calories-high
export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    const { sort, category } = req.query;
    // กำหนดค่าเริ่มต้นของ orderBy และ where
    let orderBy: any = { created_at: "desc" }; // ค่าเริ่มต้น: ใหม่ไปเก่า
    let sortedRecipeIds: number[] | undefined = undefined; // สำหรับการเรียง calories แบบ optimized
    let where: any = {};

    // หากมี category filter (และไม่ใช่ "all") ให้เพิ่มเงื่อนไขใน where
    if (category && category !== "all") {
      where.recipe_categories = {
        some: {
          category: {
            name: { equals: category, mode: "insensitive" },
          },
        },
      };
    }

    // กำหนด orderBy สำหรับ sort แบบอื่นๆ
    if (sort === "oldest") orderBy = { created_at: "asc" };
    if (sort === "rating") orderBy = { rating: "desc" };
    if (sort === "cooking-time") orderBy = { cook_time: "asc" };
    if (sort === "name-asc") orderBy = { title: "asc" };
    if (sort === "name-desc") orderBy = { title: "desc" };

    // สำหรับการ sort แบบ calories
    if (sort === "calories-low" || sort === "calories-high") {
      // หากไม่มี category filter (หรือเลือก "all") ให้ใช้ query แบบ optimized
      if (!category || category === "all") {
        const sortOrder = sort === "calories-low" ? "asc" : "desc";
        const sortedRecipes = await prisma.nutrition_facts.findMany({
          select: { recipe_id: true },
          orderBy: { calories: sortOrder },
        });
        sortedRecipeIds = sortedRecipes
          .map((r) => r.recipe_id)
          .filter((id): id is number => id !== null);
        // เมื่อใช้ sortedRecipeIds แล้ว จะไม่ส่ง orderBy ไปใน query หลัก
        orderBy = undefined;
      } else {
        // หากมี category filter เราไม่สามารถใช้ sortedRecipeIds แบบ optimized ได้
        // ให้ปล่อย orderBy เป็น undefined และทำการ sort ใน JS ภายหลัง
        orderBy = undefined;
      }
    }

    // Query สูตรอาหาร โดยนำ where condition มารวมกับ sortedRecipeIds (ถ้ามี)
    const recipes = await prisma.recipes.findMany({
      where: sortedRecipeIds ? { ...where, id: { in: sortedRecipeIds } } : where,
      include: {
        user: { select: { username: true } },
        recipe_categories: { include: { category: { select: { name: true } } } },
        recipe_ingredients: { include: { ingredients: { select: { name: true } } } },
        nutrition_facts: { select: { calories: true } },
      },
      orderBy: sortedRecipeIds ? undefined : orderBy,
    });

    // แปลงข้อมูลให้ frontend ใช้งานง่าย
    let formattedRecipes = recipes.map((recipe) => ({
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

    // ถ้า sort เป็น calories-low หรือ calories-high ให้ทำการเรียงลำดับอีกครั้งใน JS
    if (sort === "calories-low") {
      formattedRecipes.sort((a, b) => a.calories - b.calories);
    }
    if (sort === "calories-high") {
      formattedRecipes.sort((a, b) => b.calories - a.calories);
    }

    res.json({ success: true, data: formattedRecipes });
  } catch (error) {
    console.error("❌ Error fetching recipes:", error);
  }
};





export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const recipeId = Number(req.params.id);
    if (isNaN(recipeId)) {
      return res.status(400).json({ success: false, message: "Invalid recipe ID" });
    }

    // ✅ ดึงข้อมูลจากฐานข้อมูล
    const recipe = await prisma.recipes.findUnique({
      where: { id: recipeId },
      include: {
        nutrition_facts: true, // ✅ ดึงข้อมูลโภชนาการ
        recipe_categories: {
          include: { category: true }, // ✅ ดึงหมวดหมู่
        },
        recipe_ingredients: {
          include: { ingredients: true }, // ✅ ดึงส่วนผสม
        },
      },
    });

    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    // ✅ ตรวจสอบและแปลง `instructions` เป็น `string[]`
    const parsedInstructions: string[] = Array.isArray(recipe.instructions)
      ? (recipe.instructions as unknown as string[])
      : [];

    // ✅ ตรวจสอบว่า `nutrition_facts` มีค่าก่อนเข้าถึง
    const nutrition = recipe.nutrition_facts?.[0] || null;

    // ✅ แปลงข้อมูลให้ frontend ใช้งานง่ายขึ้น
    const formattedRecipe = {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      instructions: parsedInstructions, // ✅ ใช้ค่าที่ parse แล้ว
      image_url: recipe.image_url,
      cook_time: recipe.cook_time,
      rating: recipe.rating,
      created_at: recipe.created_at,

      // ✅ ดึงค่าจาก `nutrition_facts`
      nutrition_facts: nutrition
        ? {
            calories: nutrition.calories ?? null,
            total_fat: nutrition.total_fat ?? null,
            saturated_fat: nutrition.saturated_fat ?? null,
            cholesterol: nutrition.cholesterol ?? null,
            sodium: nutrition.sodium ?? null,
            potassium: nutrition.potassium ?? null,
            total_carbohydrate: nutrition.total_carbohydrate ?? null,
            sugars: nutrition.sugars ?? null,
            protein: nutrition.protein ?? null,
          }
        : null,

      // ✅ ดึงหมวดหมู่ (categories)
      categories: recipe.recipe_categories.map(rc => ({
        id: rc.category.id,
        name: rc.category.name,
        image_url: rc.category.image_url,
      })),

      // ✅ ดึง ingredients และป้องกัน errors
      ingredients: recipe.recipe_ingredients.map(ri => ({
        id: ri.ingredients?.id ?? null,
        name: ri.ingredients?.name ?? "Unknown",
        unit: ri.ingredients?.unit ?? "",
        quantity: ri.quantity ?? 0,
      })),
    };

    res.status(200).json({ success: true, data: formattedRecipe });
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
