import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ POST /api/shopping-list-items - เพิ่มวัตถุดิบเข้า Shopping List
export const addShoppingListItem = async (req: Request, res: Response) => {
  try {
    const { shopping_list_id, ingredient_id, quantity } = req.body;

    if (!shopping_list_id || !ingredient_id || !quantity) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newItem = await prisma.shopping_list_items.create({
      data: {
        shopping_list_id,
        ingredient_id,
        quantity,
      },
      include: {
        ingredients: true, // รวมข้อมูลวัตถุดิบ
      },
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error adding item to shopping list", error: error.message });
  }
};

// ✅ GET /api/shopping-list-items/:list_id - ดึงวัตถุดิบใน Shopping List
export const getShoppingListItems = async (req: Request, res: Response) => {
  try {
    const listId = Number(req.params.list_id);

    if (isNaN(listId)) {
      return res.status(400).json({ success: false, message: "Invalid shopping list ID" });
    }

    const items = await prisma.shopping_list_items.findMany({
      where: { shopping_list_id: listId },
      include: {
        ingredients: true, // ดึงข้อมูล ingredient ของแต่ละรายการ
      },
    });

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

    if (isNaN(itemId) || !quantity) {
      return res.status(400).json({ success: false, message: "Invalid item ID or missing quantity" });
    }

    const updatedItem = await prisma.shopping_list_items.update({
      where: { id: itemId },
      data: { quantity },
    });

    res.json({ success: true, data: updatedItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error updating shopping list item", error: error.message });
  }
};

// ✅ DELETE /api/shopping-list-items/:id - ลบวัตถุดิบออกจาก Shopping List
export const deleteShoppingListItem = async (req: Request, res: Response) => {
  try {
    const itemId = Number(req.params.id);

    if (isNaN(itemId)) {
      return res.status(400).json({ success: false, message: "Invalid item ID" });
    }

    // ตรวจสอบก่อนว่ารายการมีอยู่จริงหรือไม่
    const existingItem = await prisma.shopping_list_items.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      return res.status(404).json({ success: false, message: "Shopping list item not found" });
    }

    await prisma.shopping_list_items.delete({
      where: { id: itemId },
    });

    res.json({ success: true, message: "Shopping list item deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error deleting shopping list item", error: error.message });
  }
};
