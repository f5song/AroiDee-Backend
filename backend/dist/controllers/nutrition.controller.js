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
exports.deleteNutrition = exports.updateNutrition = exports.getNutritionByRecipeId = exports.createNutrition = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ✅ POST /api/nutrition - เพิ่มข้อมูลโภชนาการให้สูตรอาหาร
const createNutrition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newNutrition = yield prisma.nutrition_facts.create({
            data: req.body, // ตรวจสอบให้แน่ใจว่า req.body มีค่าที่ถูกต้อง
        });
        res.status(201).json({ success: true, data: newNutrition });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error creating nutrition", error: error.message });
    }
});
exports.createNutrition = createNutrition;
// ✅ GET /api/nutrition/:recipe_id - ดึงข้อมูลโภชนาการของสูตรอาหาร
const getNutritionByRecipeId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipeId = Number(req.params.recipe_id);
        // ใช้ findFirst เพราะ recipe_id ไม่ใช่ unique key
        const nutrition = yield prisma.nutrition_facts.findFirst({
            where: { recipe_id: recipeId },
        });
        if (!nutrition) {
            return res.status(404).json({ success: false, message: "Nutrition facts not found" });
        }
        res.json({ success: true, data: nutrition });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error fetching nutrition", error: error.message });
    }
});
exports.getNutritionByRecipeId = getNutritionByRecipeId;
// ✅ PUT /api/nutrition/:id - แก้ไขข้อมูลโภชนาการ
const updateNutrition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedNutrition = yield prisma.nutrition_facts.update({
            where: { id: Number(req.params.id) },
            data: req.body, // ตรวจสอบให้แน่ใจว่ามีค่าที่จะอัปเดต
        });
        res.json({ success: true, data: updatedNutrition });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error updating nutrition", error: error.message });
    }
});
exports.updateNutrition = updateNutrition;
// ✅ DELETE /api/nutrition/:id - ลบข้อมูลโภชนาการ
const deleteNutrition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.nutrition_facts.delete({
            where: { id: Number(req.params.id) },
        });
        res.json({ success: true, message: "Nutrition facts deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error deleting nutrition", error: error.message });
    }
});
exports.deleteNutrition = deleteNutrition;
