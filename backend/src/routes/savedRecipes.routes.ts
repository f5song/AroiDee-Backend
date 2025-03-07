import express from "express";
import {
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes,
} from "../controllers/savedRecipes.controller";

const router = express.Router();

router.post("/save-recipe", saveRecipe);
router.post("/unsave-recipe", unsaveRecipe);
router.get("/:user_id/saved-recipes", getSavedRecipes);

export default router;
