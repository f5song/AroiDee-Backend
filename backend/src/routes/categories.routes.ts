import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import {
  getAllCategories,
  createCategory,
  deleteCategory
} from "../controllers/categories.controller";

const router = express.Router();

// ✅ GET /api/categories - ดึงรายการหมวดหมู่ทั้งหมด
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAllCategories(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ POST /api/categories - สร้างหมวดหมู่ใหม่
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createCategory(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ DELETE /api/categories/:id - ลบหมวดหมู่
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteCategory(req, res);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
