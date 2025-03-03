import { Request, Response } from "express";
import {
  createCategoryService,
  getAllCategoriesService,
  deleteCategoryService,
} from "../services/categories.service";

// ✅ POST /api/categories - เพิ่มหมวดหมู่ใหม่
export const createCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = await createCategoryService(req.body);
    res.status(201).json({ success: true, data: newCategory });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error creating category", error: error.message });
  }
};

// ✅ GET /api/categories - ดึงรายการหมวดหมู่ทั้งหมด
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategoriesService();
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching categories", error: error.message });
  }
};

// ✅ DELETE /api/categories/:id - ลบหมวดหมู่
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await deleteCategoryService(Number(req.params.id));
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error deleting category", error: error.message });
  }
};
