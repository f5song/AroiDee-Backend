import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ POST /api/ingredients - เพิ่มวัตถุดิบใหม่
export const createIngredient = async (req: Request, res: Response) => {
  try {
    const { name, unit } = req.body;

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
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ GET /api/ingredients - ดึงรายการวัตถุดิบทั้งหมด
export const getAllIngredients = async (_req: Request, res: Response) => {
  try {
    const ingredients = await prisma.ingredients.findMany();
    res.json({ success: true, data: ingredients });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET /api/ingredients/:id - ดึงข้อมูลวัตถุดิบตาม ID
export const getIngredientById = async (req: Request, res: Response) => {
  try {
    const ingredient = await prisma.ingredients.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!ingredient) {
      return res.status(404).json({ success: false, message: "Ingredient not found" });
    }

    res.json({ success: true, data: ingredient });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// ✅ PUT /api/ingredients/:id - แก้ไขข้อมูลวัตถุดิบ
export const updateIngredient = async (req: Request, res: Response) => {
  try {
    const { name, unit } = req.body;

    const updatedIngredient = await prisma.ingredients.update({
      where: { id: Number(req.params.id) },
      data: { name, unit },
    });

    res.json({ success: true, data: updatedIngredient });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ DELETE /api/ingredients/:id - ลบวัตถุดิบ
export const deleteIngredient = async (req: Request, res: Response) => {
  try {
    await prisma.ingredients.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ success: true, message: "Ingredient deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
