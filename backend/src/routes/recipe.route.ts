import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  searchRecipes,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipe.controller";

const router = express.Router();

// ✅ POST /api/recipes - สร้างสูตรอาหารใหม่
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createRecipe(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ GET /api/recipes - ดึงรายการสูตรอาหารทั้งหมด
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAllRecipes(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ GET /api/recipes/search - ค้นหาสูตรอาหาร
router.get(
  "/search",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await searchRecipes(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ GET /api/recipes/:id - ดึงรายละเอียดสูตรอาหารตาม ID
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getRecipeById(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ PUT /api/recipes/:id - อัปเดตข้อมูลสูตรอาหาร
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateRecipe(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ DELETE /api/recipes/:id - ลบสูตรอาหาร
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteRecipe(req, res);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
