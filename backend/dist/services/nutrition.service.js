"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNutritionService = exports.updateNutritionService = exports.getNutritionByRecipeIdService = exports.createNutritionService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ✅ เพิ่มข้อมูลโภชนาการให้สูตรอาหาร
const createNutritionService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.nutrition_facts.create({ data });
});
exports.createNutritionService = createNutritionService;
// ✅ ดึงข้อมูลโภชนาการของสูตรอาหาร
const getNutritionByRecipeIdService = (recipe_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.nutrition_facts.findFirst({ where: { recipe_id } });
});
exports.getNutritionByRecipeIdService = getNutritionByRecipeIdService;
// ✅ อัปเดตข้อมูลโภชนาการ
const updateNutritionService = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.nutrition_facts.update({ where: { id }, data });
});
exports.updateNutritionService = updateNutritionService;
// ✅ ลบข้อมูลโภชนาการ
const deleteNutritionService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.nutrition_facts.delete({ where: { id } });
});
exports.deleteNutritionService = deleteNutritionService;
