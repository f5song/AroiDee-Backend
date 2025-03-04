import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import {
  addShoppingListItem,
  getShoppingListItems,
  updateShoppingListItem,
  deleteShoppingListItem,
} from "../controllers/shoppingListItem.controller";

const router = express.Router();

// ✅ POST /api/shopping-list-items - เพิ่มวัตถุดิบเข้า Shopping List
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await addShoppingListItem(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ GET /api/shopping-list-items/:list_id - ดึงวัตถุดิบใน Shopping List
router.get(
  "/:list_id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getShoppingListItems(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ PUT /api/shopping-list-items/:id - แก้ไขจำนวนวัตถุดิบใน Shopping List
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateShoppingListItem(req, res);
    } catch (error) {
      next(error);
    }
  })
);

// ✅ DELETE /api/shopping-list-items/:id - ลบวัตถุดิบออกจาก Shopping List
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteShoppingListItem(req, res);
    } catch (error) {
      next(error);
    }
  })
);

export default router;
