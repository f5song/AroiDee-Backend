import { Request, Response } from "express";
import {
  createNutritionService,
  getNutritionByRecipeIdService,
  updateNutritionService,
  deleteNutritionService,
} from "../services/nutrition.service";

// ✅ POST /api/nutrition - เพิ่มข้อมูลโภชนาการให้สูตรอาหาร
export const createNutrition = async (req: Request, res: Response) => {
  try {
    const newNutrition = await createNutritionService(req.body);
    res.status(201).json({ success: true, data: newNutrition }); // ✅ ไม่มี return
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error creating nutrition", error: error.message });
  }
};

// ✅ GET /api/nutrition/:recipe_id - ดึงข้อมูลโภชนาการของสูตรอาหาร
export const getNutritionByRecipeId = async (req: Request, res: Response) => {
  try {
    const nutrition = await getNutritionByRecipeIdService(Number(req.params.recipe_id));

    if (!nutrition) {
      res.status(404).json({ success: false, message: "Nutrition facts not found" });
      return;
    }

    res.json({ success: true, data: nutrition });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching nutrition", error: error.message });
  }
};

// ✅ PUT /api/nutrition/:id - แก้ไขข้อมูลโภชนาการ
export const updateNutrition = async (req: Request, res: Response) => {
  try {
    const updatedNutrition = await updateNutritionService(Number(req.params.id), req.body);
    res.json({ success: true, data: updatedNutrition });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error updating nutrition", error: error.message });
  }
};

// ✅ DELETE /api/nutrition/:id - ลบข้อมูลโภชนาการ
export const deleteNutrition = async (req: Request, res: Response) => {
  try {
    await deleteNutritionService(Number(req.params.id));
    res.json({ success: true, message: "Nutrition facts deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error deleting nutrition", error: error.message });
  }
};
