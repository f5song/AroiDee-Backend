import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import {
  createIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
} from "../controllers/ingredient.controller";

const router = express.Router();

// ✅ POST /api/ingredients - เพิ่มวัตถุดิบใหม่
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createIngredient(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ GET /api/ingredients - ดึงรายการวัตถุดิบทั้งหมด
router.get("/", getAllIngredients); // ❌ `asyncHandler` ไม่จำเป็น

// ✅ GET /api/ingredients/:id - ดึงข้อมูลวัตถุดิบตาม ID
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getIngredientById(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ PUT /api/ingredients/:id - แก้ไขข้อมูลวัตถุดิบ
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateIngredient(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ DELETE /api/ingredients/:id - ลบวัตถุดิบ
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteIngredient(req, res);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
