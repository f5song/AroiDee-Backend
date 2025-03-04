import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ POST /api/categories - เพิ่มหมวดหมู่ใหม่
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    // ตรวจสอบว่าชื่อหมวดหมู่ซ้ำหรือไม่
    const existingCategory = await prisma.categories.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const newCategory = await prisma.categories.create({
      data: { name },
    });

    res.status(201).json({ success: true, data: newCategory });
  } catch (error: any) {
    console.error("Error creating category:", error);
    res.status(500).json({ success: false, message: "Error creating category", error: error.message });
  }
};

// ✅ GET /api/categories - ดึงรายการหมวดหมู่ทั้งหมด
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.categories.findMany();
    res.json({ success: true, data: categories });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Error fetching categories", error: error.message });
  }
};

// ✅ DELETE /api/categories/:id - ลบหมวดหมู่
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);

    // ตรวจสอบว่าหมวดหมู่ที่ต้องการลบมีอยู่หรือไม่
    const category = await prisma.categories.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    await prisma.categories.delete({
      where: { id: categoryId },
    });

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: "Error deleting category", error: error.message });
  }
};
