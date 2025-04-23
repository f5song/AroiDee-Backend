import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ สร้างหมวดหมู่ใหม่
export const createCategoryService = async (data: { name: string }) => {
  return await prisma.categories.create({
    data,
  });
};

// ✅ ดึงรายการหมวดหมู่ทั้งหมด
export const getAllCategoriesService = async () => {
  return await prisma.categories.findMany();
};

// ✅ ลบหมวดหมู่
export const deleteCategoryService = async (id: number) => {
  return await prisma.categories.delete({
    where: { id },
  });
};
