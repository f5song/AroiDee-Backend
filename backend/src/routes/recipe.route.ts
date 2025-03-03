import express from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  searchRecipes,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipe.controller";

const router = express.Router();

router.post("/", createRecipe);
router.get("/", getAllRecipes);
router.get("/search", searchRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

export default router;
