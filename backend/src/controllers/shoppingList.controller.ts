import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ POST /api/shopping-lists - สร้างรายการซื้อของใหม่
export const createShoppingList = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const newList = await prisma.shopping_lists.create({
      data: {
        user_id,
      },
      include: {
        shopping_list_items: true, // รวมรายการสินค้าใน shopping list
      },
    });

    res.status(201).json({ success: true, data: newList });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error creating shopping list", error: error.message });
  }
};

// ✅ GET /api/shopping-lists - ดึงรายการซื้อของทั้งหมดของผู้ใช้
export const getAllShoppingLists = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.user_id); // รับ user_id จาก query parameter

    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const lists = await prisma.shopping_lists.findMany({
      where: { user_id: userId },
      include: {
        shopping_list_items: {
          include: {
            ingredients: true, // ดึงข้อมูล ingredient ของรายการซื้อของ
          },
        },
      },
    });

    res.json({ success: true, data: lists });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching shopping lists", error: error.message });
  }
};

// ✅ GET /api/shopping-lists/:id - ดึงรายละเอียดของรายการซื้อของ
export const getShoppingListById = async (req: Request, res: Response) => {
  try {
    const listId = Number(req.params.id);

    if (isNaN(listId)) {
      return res.status(400).json({ success: false, message: "Invalid shopping list ID" });
    }

    const list = await prisma.shopping_lists.findUnique({
      where: { id: listId },
      include: {
        shopping_list_items: {
          include: {
            ingredients: true, // ดึงข้อมูล ingredient ของรายการซื้อของ
          },
        },
      },
    });

    if (!list) {
      return res.status(404).json({ success: false, message: "Shopping list not found" });
    }

    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching shopping list", error: error.message });
  }
};

// ✅ DELETE /api/shopping-lists/:id - ลบรายการซื้อของ
export const deleteShoppingList = async (req: Request, res: Response) => {
  try {
    const listId = Number(req.params.id);

    if (isNaN(listId)) {
      return res.status(400).json({ success: false, message: "Invalid shopping list ID" });
    }

    // ตรวจสอบก่อนว่ารายการมีอยู่จริงหรือไม่
    const existingList = await prisma.shopping_lists.findUnique({
      where: { id: listId },
    });

    if (!existingList) {
      return res.status(404).json({ success: false, message: "Shopping list not found" });
    }

    await prisma.shopping_lists.delete({
      where: { id: listId },
    });

    res.json({ success: true, message: "Shopping list deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error deleting shopping list", error: error.message });
  }
};
