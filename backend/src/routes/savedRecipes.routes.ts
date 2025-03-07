import express from "express";
import { saveRecipe, unsaveRecipe, getSavedRecipes } from "../controllers/savedRecipes.controller";

const router = express.Router();

router.post("/save", saveRecipe);
router.post("/unsave", unsaveRecipe);
router.get("/:user_id", getSavedRecipes);

export default router;
