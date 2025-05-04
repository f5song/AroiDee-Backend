// routes/meals.route.ts
import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { createMeal, getMealsByDate, deleteMeal } from "../controllers/meals.controller";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

// POST /api/meals
router.post(
  "/",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createMeal(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// GET /api/meals/users/:user_id?date=2025-05-02
router.get(
  "/users/:user_id/meals",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getMealsByDate(req, res);
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  "/:id",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteMeal(req, res);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
