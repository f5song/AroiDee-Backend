import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ สร้างรายการซื้อของใหม่
export const createShoppingListService = async (data: { user_id: number; name: string }) => {
  return await prisma.shopping_lists.create({
    data,
  });
};

// ✅ ดึงรายการซื้อของทั้งหมดของผู้ใช้
export const getAllShoppingListsService = async (user_id: number) => {
  return await prisma.shopping_lists.findMany({
    where: { user_id },
    include: { shopping_list_items: true }, // ดึงรายการวัตถุดิบในลิสต์มาด้วย
  });
};

// ✅ ดึงรายละเอียดของรายการซื้อของ
export const getShoppingListByIdService = async (id: number) => {
  return await prisma.shopping_lists.findUnique({
    where: { id },
    include: { shopping_list_items: true },
  });
};

// ✅ ลบรายการซื้อของ
export const deleteShoppingListService = async (id: number) => {
  return await prisma.shopping_lists.delete({
    where: { id },
  });
};
