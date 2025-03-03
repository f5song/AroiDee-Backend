import { Request, Response } from "express";
import {
  createShoppingListService,
  getAllShoppingListsService,
  getShoppingListByIdService,
  deleteShoppingListService,
} from "../services/shoppingList.service";

// ✅ POST /api/shopping-lists - สร้างรายการซื้อของใหม่
export const createShoppingList = async (req: Request, res: Response) => {
  try {
    const newList = await createShoppingListService(req.body);
    res.status(201).json({ success: true, data: newList });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error creating shopping list", error: error.message });
  }
};

// ✅ GET /api/shopping-lists - ดึงรายการซื้อของทั้งหมดของผู้ใช้
export const getAllShoppingLists = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.user_id); // รับ user_id จาก query parameter
    const lists = await getAllShoppingListsService(userId);
    res.json({ success: true, data: lists });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching shopping lists", error: error.message });
  }
};

// ✅ GET /api/shopping-lists/:id - ดึงรายละเอียดของรายการซื้อของ
export const getShoppingListById = async (req: Request, res: Response) => {
  try {
    const listId = Number(req.params.id);
    const list = await getShoppingListByIdService(listId);

    if (!list) {
      res.status(404).json({ success: false, message: "Shopping list not found" });
      return;
    }

    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching shopping list", error: error.message });
  }
};

// ✅ DELETE /api/shopping-lists/:id - ลบรายการซื้อของ
export const deleteShoppingList = async (req: Request, res: Response) => {
  try {
    await deleteShoppingListService(Number(req.params.id));
    res.json({ success: true, message: "Shopping list deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error deleting shopping list", error: error.message });
  }
};
