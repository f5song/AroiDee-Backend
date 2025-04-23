import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ เพิ่มวัตถุดิบเข้า Shopping List
export const addShoppingListItemService = async (data: { shopping_list_id: number; ingredient_id: number; quantity: number }) => {
  return await prisma.shopping_list_items.create({
    data,
  });
};

// ✅ ดึงวัตถุดิบใน Shopping List
export const getShoppingListItemsService = async (shopping_list_id: number) => {
  return await prisma.shopping_list_items.findMany({
    where: { shopping_list_id },
    include: { ingredients: true }, // ดึงข้อมูลวัตถุดิบมาด้วย
  });
};

// ✅ แก้ไขจำนวนวัตถุดิบใน Shopping List
export const updateShoppingListItemService = async (id: number, quantity: number) => {
  return await prisma.shopping_list_items.update({
    where: { id },
    data: { quantity },
  });
};

// ✅ ลบวัตถุดิบออกจาก Shopping List
export const deleteShoppingListItemService = async (id: number) => {
  return await prisma.shopping_list_items.delete({
    where: { id },
  });
};
