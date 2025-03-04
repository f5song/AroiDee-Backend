import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ POST /api/ingredients - เพิ่มวัตถุดิบใหม่
export const createIngredient = async (req: Request, res: Response) => {
  try {
    const { name, unit } = req.body;

    if (!name || !unit) {
      return res.status(400).json({ success: false, message: "Name and unit are required" });
    }

    // ตรวจสอบว่ามี ingredient นี้อยู่แล้วหรือไม่
    const existingIngredient = await prisma.ingredients.findUnique({
      where: { name },
    });

    if (existingIngredient) {
      return res.status(400).json({ success: false, message: "Ingredient already exists" });
    }

    const newIngredient = await prisma.ingredients.create({
      data: { name, unit },
    });

    res.status(201).json({ success: true, data: newIngredient });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error creating ingredient", error: error.message });
  }
};

// ✅ GET /api/ingredients - ดึงรายการวัตถุดิบทั้งหมด
export const getAllIngredients = async (_req: Request, res: Response) => {
  try {
    const ingredients = await prisma.ingredients.findMany();
    res.status(200).json({ success: true, data: ingredients });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching ingredients", error: error.message });
  }
};

// ✅ GET /api/ingredients/:id - ดึงข้อมูลวัตถุดิบตาม ID
export const getIngredientById = async (req: Request, res: Response) => {
  try {
    const ingredientId = Number(req.params.id);
    if (isNaN(ingredientId)) {
      return res.status(400).json({ success: false, message: "Invalid ingredient ID" });
    }

    const ingredient = await prisma.ingredients.findUnique({
      where: { id: ingredientId },
    });

    if (!ingredient) {
      return res.status(404).json({ success: false, message: "Ingredient not found" });
    }

    res.status(200).json({ success: true, data: ingredient });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching ingredient", error: error.message });
  }
};

// ✅ PUT /api/ingredients/:id - แก้ไขข้อมูลวัตถุดิบ
export const updateIngredient = async (req: Request, res: Response) => {
  try {
    const ingredientId = Number(req.params.id);
    const { name, unit } = req.body;

    if (isNaN(ingredientId)) {
      return res.status(400).json({ success: false, message: "Invalid ingredient ID" });
    }
    if (!name || !unit) {
      return res.status(400).json({ success: false, message: "Name and unit are required" });
    }

    const updatedIngredient = await prisma.ingredients.update({
      where: { id: ingredientId },
      data: { name, unit },
    });

    res.status(200).json({ success: true, data: updatedIngredient });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error updating ingredient", error: error.message });
  }
};

// ✅ DELETE /api/ingredients/:id - ลบวัตถุดิบ
export const deleteIngredient = async (req: Request, res: Response) => {
  try {
    const ingredientId = Number(req.params.id);
    if (isNaN(ingredientId)) {
      return res.status(400).json({ success: false, message: "Invalid ingredient ID" });
    }

    await prisma.ingredients.delete({
      where: { id: ingredientId },
    });

    res.status(200).json({ success: true, message: "Ingredient deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error deleting ingredient", error: error.message });
  }
};
