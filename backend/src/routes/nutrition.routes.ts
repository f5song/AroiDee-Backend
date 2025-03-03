import express from "express";
import {
  createNutrition,
  getNutritionByRecipeId,
  updateNutrition,
  deleteNutrition,
} from "../controllers/nutrition.controller";

const router = express.Router();

router.post("/", createNutrition);
router.get("/:recipe_id", getNutritionByRecipeId);
router.put("/:id", updateNutrition);
router.delete("/:id", deleteNutrition);

export default router;
