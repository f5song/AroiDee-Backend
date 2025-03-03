import { Request, Response } from "express";
import {
  addShoppingListItemService,
  getShoppingListItemsService,
  updateShoppingListItemService,
  deleteShoppingListItemService,
} from "../services/shoppingListItem.service";

// ✅ POST /api/shopping-list-items - เพิ่มวัตถุดิบเข้า Shopping List
export const addShoppingListItem = async (req: Request, res: Response) => {
  try {
    const newItem = await addShoppingListItemService(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error adding item to shopping list", error: error.message });
  }
};

// ✅ GET /api/shopping-list-items/:list_id - ดึงวัตถุดิบใน Shopping List
export const getShoppingListItems = async (req: Request, res: Response) => {
  try {
    const listId = Number(req.params.list_id);
    const items = await getShoppingListItemsService(listId);
    res.json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching shopping list items", error: error.message });
  }
};

// ✅ PUT /api/shopping-list-items/:id - แก้ไขจำนวนวัตถุดิบใน Shopping List
export const updateShoppingListItem = async (req: Request, res: Response) => {
  try {
    const itemId = Number(req.params.id);
    const { quantity } = req.body;

    const updatedItem = await updateShoppingListItemService(itemId, quantity);
    res.json({ success: true, data: updatedItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error updating shopping list item", error: error.message });
  }
};

// ✅ DELETE /api/shopping-list-items/:id - ลบวัตถุดิบออกจาก Shopping List
export const deleteShoppingListItem = async (req: Request, res: Response) => {
  try {
    await deleteShoppingListItemService(Number(req.params.id));
    res.json({ success: true, message: "Shopping list item deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error deleting shopping list item", error: error.message });
  }
};
