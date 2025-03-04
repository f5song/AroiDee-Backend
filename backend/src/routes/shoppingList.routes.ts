import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import {
  createShoppingList,
  getAllShoppingLists,
  getShoppingListById,
  deleteShoppingList,
} from "../controllers/shoppingList.controller";

const router = express.Router();

// ✅ POST /api/shopping-lists - สร้างรายการซื้อของใหม่
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createShoppingList(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ GET /api/shopping-lists - ดึงรายการซื้อของทั้งหมด
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAllShoppingLists(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ GET /api/shopping-lists/:id - ดึงรายละเอียดของรายการซื้อของ
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getShoppingListById(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ DELETE /api/shopping-lists/:id - ลบรายการซื้อของ
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteShoppingList(req, res);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
