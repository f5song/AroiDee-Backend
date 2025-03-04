import express from "express";
import { Request, Response } from "express";
import { getAllCategories, createCategory, deleteCategory } from "../controllers/categories.controller";

const router = express.Router();

router.get("/categories", async (req: Request, res: Response) => {
  await getAllCategories(req, res);
});

router.post("/categories", async (req: Request, res: Response) => {
  await createCategory(req, res);
});

router.delete("/categories/:id", async (req: Request, res: Response) => {
  await deleteCategory(req, res);
});

export default router;
