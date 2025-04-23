import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ เพิ่มข้อมูลโภชนาการให้สูตรอาหาร
export const createNutritionService = async (data: any) => {
  return await prisma.nutrition_facts.create({ data });
};

// ✅ ดึงข้อมูลโภชนาการของสูตรอาหาร
export const getNutritionByRecipeIdService = async (recipe_id: number) => {
  return await prisma.nutrition_facts.findFirst({ where: { recipe_id } });
};

// ✅ อัปเดตข้อมูลโภชนาการ
export const updateNutritionService = async (id: number, data: any) => {
  return await prisma.nutrition_facts.update({ where: { id }, data });
};

// ✅ ลบข้อมูลโภชนาการ
export const deleteNutritionService = async (id: number) => {
  return await prisma.nutrition_facts.delete({ where: { id } });
};
