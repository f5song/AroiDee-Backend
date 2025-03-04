import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import {
  createNutrition,
  getNutritionByRecipeId,
  updateNutrition,
  deleteNutrition,
} from "../controllers/nutrition.controller";

const router = express.Router();

// ✅ POST /api/nutrition - เพิ่มข้อมูลโภชนาการให้สูตรอาหาร
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createNutrition(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ GET /api/nutrition/:recipe_id - ดึงข้อมูลโภชนาการของสูตรอาหาร
router.get(
  "/:recipe_id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getNutritionByRecipeId(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ PUT /api/nutrition/:id - แก้ไขข้อมูลโภชนาการ
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateNutrition(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ DELETE /api/nutrition/:id - ลบข้อมูลโภชนาการ
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteNutrition(req, res);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
