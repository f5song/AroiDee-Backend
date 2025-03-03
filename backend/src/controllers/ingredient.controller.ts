import { Request, Response } from "express";
import * as ingredientService from "../services/ingredient.service";

// ✅ POST /api/ingredients - เพิ่มวัตถุดิบใหม่
export const createIngredient = async (req: Request, res: Response) => {
  try {
    const { name, unit } = req.body;
    const newIngredient = await ingredientService.createIngredient(name, unit);
    res.status(201).json({ success: true, data: newIngredient });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ GET /api/ingredients - ดึงรายการวัตถุดิบทั้งหมด
export const getAllIngredients = async (_req: Request, res: Response) => {
  try {
    const ingredients = await ingredientService.getAllIngredients();
    res.json({ success: true, data: ingredients });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET /api/ingredients/:id - ดึงข้อมูลวัตถุดิบตาม ID
export const getIngredientById = async (req: Request, res: Response) => {
  try {
    const ingredient = await ingredientService.getIngredientById(Number(req.params.id));
    res.json({ success: true, data: ingredient });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// ✅ PUT /api/ingredients/:id - แก้ไขข้อมูลวัตถุดิบ
export const updateIngredient = async (req: Request, res: Response) => {
  try {
    const { name, unit } = req.body;
    const updatedIngredient = await ingredientService.updateIngredient(Number(req.params.id), name, unit);
    res.json({ success: true, data: updatedIngredient });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ DELETE /api/ingredients/:id - ลบวัตถุดิบ
export const deleteIngredient = async (req: Request, res: Response) => {
  try {
    await ingredientService.deleteIngredient(Number(req.params.id));
    res.json({ success: true, message: "Ingredient deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
