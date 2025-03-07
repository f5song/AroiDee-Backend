import express from "express";
import { saveRecipe, unsaveRecipe, getSavedRecipes } from "../controllers/savedRecipes.controller"; // ตรวจสอบว่า import ถูกต้อง

const router = express.Router();

// ใช้ express.json() สำหรับ request body
router.use(express.json());

// ตรวจสอบ POST และ GET สำหรับการเชื่อมต่อ API
router.post("/save-recipe", saveRecipe);           // API สำหรับบันทึกสูตรอาหาร
router.post("/unsave-recipe", unsaveRecipe);       // API สำหรับยกเลิกการบันทึกสูตรอาหาร
router.get("/:user_id/saved-recipes", getSavedRecipes); // API สำหรับดึงรายการสูตรที่ผู้ใช้บันทึก

export default router;
