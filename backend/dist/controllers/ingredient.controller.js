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
exports.deleteIngredient = exports.updateIngredient = exports.getIngredientById = exports.getAllIngredients = exports.createIngredient = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ✅ POST /api/ingredients - เพิ่มวัตถุดิบใหม่
const createIngredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, unit } = req.body;
        if (!name || !unit) {
            return res.status(400).json({ success: false, message: "Name and unit are required" });
        }
        // ตรวจสอบว่ามี ingredient นี้อยู่แล้วหรือไม่
        const existingIngredient = yield prisma.ingredients.findUnique({
            where: { name },
        });
        if (existingIngredient) {
            return res.status(400).json({ success: false, message: "Ingredient already exists" });
        }
        const newIngredient = yield prisma.ingredients.create({
            data: { name, unit },
        });
        res.status(201).json({ success: true, data: newIngredient });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error creating ingredient", error: error.message });
    }
});
exports.createIngredient = createIngredient;
// ✅ GET /api/ingredients - ดึงรายการวัตถุดิบทั้งหมด
const getAllIngredients = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ingredients = yield prisma.ingredients.findMany();
        res.status(200).json({ success: true, data: ingredients });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error fetching ingredients", error: error.message });
    }
});
exports.getAllIngredients = getAllIngredients;
// ✅ GET /api/ingredients/:id - ดึงข้อมูลวัตถุดิบตาม ID
const getIngredientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ingredientId = Number(req.params.id);
        if (isNaN(ingredientId)) {
            return res.status(400).json({ success: false, message: "Invalid ingredient ID" });
        }
        const ingredient = yield prisma.ingredients.findUnique({
            where: { id: ingredientId },
        });
        if (!ingredient) {
            return res.status(404).json({ success: false, message: "Ingredient not found" });
        }
        res.status(200).json({ success: true, data: ingredient });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error fetching ingredient", error: error.message });
    }
});
exports.getIngredientById = getIngredientById;
// ✅ PUT /api/ingredients/:id - แก้ไขข้อมูลวัตถุดิบ
const updateIngredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ingredientId = Number(req.params.id);
        const { name, unit } = req.body;
        if (isNaN(ingredientId)) {
            return res.status(400).json({ success: false, message: "Invalid ingredient ID" });
        }
        if (!name || !unit) {
            return res.status(400).json({ success: false, message: "Name and unit are required" });
        }
        const updatedIngredient = yield prisma.ingredients.update({
            where: { id: ingredientId },
            data: { name, unit },
        });
        res.status(200).json({ success: true, data: updatedIngredient });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error updating ingredient", error: error.message });
    }
});
exports.updateIngredient = updateIngredient;
// ✅ DELETE /api/ingredients/:id - ลบวัตถุดิบ
const deleteIngredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ingredientId = Number(req.params.id);
        if (isNaN(ingredientId)) {
            return res.status(400).json({ success: false, message: "Invalid ingredient ID" });
        }
        yield prisma.ingredients.delete({
            where: { id: ingredientId },
        });
        res.status(200).json({ success: true, message: "Ingredient deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error deleting ingredient", error: error.message });
    }
});
exports.deleteIngredient = deleteIngredient;
