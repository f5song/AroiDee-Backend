import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";  // ใช้ asyncHandler สำหรับการจัดการ asynchronous functions
import { saveRecipe, unsaveRecipe, getSavedRecipes } from "../controllers/savedRecipes.controller"; // ตรวจสอบว่า import ถูกต้อง

const router = express.Router();

// ใช้ express.json() สำหรับ request body
router.use(express.json());

// ✅ API สำหรับบันทึกสูตรอาหาร
router.post("/save-recipe", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await saveRecipe(req, res);
  } catch (error) {
    next(error);  // ถ้ามี error จะถูกส่งต่อไปยัง middleware ที่ใช้จัดการ error
  }
}));

// ✅ API สำหรับยกเลิกการบันทึกสูตรอาหาร
router.post("/unsave-recipe", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await unsaveRecipe(req, res);
  } catch (error) {
    next(error);  // ส่ง error ไปที่ next
  }
}));

// ✅ API สำหรับดึงรายการสูตรที่ผู้ใช้บันทึก
router.get("/:user_id/saved-recipes", asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getSavedRecipes(req, res);
  } catch (error) {
    next(error);  // ส่ง error ไปที่ next
  }
}));

export default router;
