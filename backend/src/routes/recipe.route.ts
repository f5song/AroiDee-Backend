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
import authMiddleware from "../middlewares/authMiddleware"; // ✅ ใช้ Default Import ถ้า Export แบบ `export default`

const router = express.Router();

// ✅ GET /api/recipes - ดึงรายการสูตรอาหารทั้งหมด (ทุกคนเข้าถึงได้)
router.get("/", asyncHandler(async (req, res, next) => {
  try {
    await getAllRecipes(req, res);
  } catch (error) {
    next(error);
  }
}));

// ✅ GET /api/recipes/search - ค้นหาสูตรอาหาร (ทุกคนเข้าถึงได้)
router.get("/search", asyncHandler(async (req, res, next) => {
  try {
    await searchRecipes(req, res);
  } catch (error) {
    next(error);
  }
}));

// ✅ GET /api/recipes/:id - ดึงรายละเอียดสูตรอาหารตาม ID (ทุกคนเข้าถึงได้)
router.get("/:id", asyncHandler(async (req, res, next) => {
  try {
    await getRecipeById(req, res);
  } catch (error) {
    next(error);
  }
}));

// ✅ POST /api/recipes - สร้างสูตรอาหารใหม่ (ต้องล็อกอินก่อน)
router.post("/", authMiddleware, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createRecipe(req, res);
  } catch (error) {
    next(error);
  }
}));

// ✅ PUT /api/recipes/:id - อัปเดตข้อมูลสูตรอาหาร (ต้องล็อกอินก่อน)
router.put("/:id", authMiddleware, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateRecipe(req, res);
  } catch (error) {
    next(error);
  }
}));

// ✅ DELETE /api/recipes/:id - ลบสูตรอาหาร (ต้องล็อกอินก่อน)
router.delete("/:id", authMiddleware, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteRecipe(req, res);
  } catch (error) {
    next(error);
  }
}));

export default router;
