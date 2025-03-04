import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ POST /api/nutrition - เพิ่มข้อมูลโภชนาการให้สูตรอาหาร
export const createNutrition = async (req: Request, res: Response) => {
  try {
    const newNutrition = await prisma.nutrition_facts.create({
      data: req.body, // ตรวจสอบให้แน่ใจว่า req.body มีค่าที่ถูกต้อง
    });

    res.status(201).json({ success: true, data: newNutrition });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error creating nutrition", error: error.message });
  }
};

// ✅ GET /api/nutrition/:recipe_id - ดึงข้อมูลโภชนาการของสูตรอาหาร
export const getNutritionByRecipeId = async (req: Request, res: Response) => {
  try {
    const recipeId = Number(req.params.recipe_id);

    // ใช้ findFirst เพราะ recipe_id ไม่ใช่ unique key
    const nutrition = await prisma.nutrition_facts.findFirst({
      where: { recipe_id: recipeId },
    });

    if (!nutrition) {
      return res.status(404).json({ success: false, message: "Nutrition facts not found" });
    }

    res.json({ success: true, data: nutrition });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching nutrition", error: error.message });
  }
};

// ✅ PUT /api/nutrition/:id - แก้ไขข้อมูลโภชนาการ
export const updateNutrition = async (req: Request, res: Response) => {
  try {
    const updatedNutrition = await prisma.nutrition_facts.update({
      where: { id: Number(req.params.id) },
      data: req.body, // ตรวจสอบให้แน่ใจว่ามีค่าที่จะอัปเดต
    });

    res.json({ success: true, data: updatedNutrition });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error updating nutrition", error: error.message });
  }
};

// ✅ DELETE /api/nutrition/:id - ลบข้อมูลโภชนาการ
export const deleteNutrition = async (req: Request, res: Response) => {
  try {
    await prisma.nutrition_facts.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ success: true, message: "Nutrition facts deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error deleting nutrition", error: error.message });
  }
};
