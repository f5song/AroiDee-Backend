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
exports.deleteCategory = exports.getAllCategories = exports.createCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ✅ POST /api/categories - เพิ่มหมวดหมู่ใหม่
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        // ตรวจสอบว่าชื่อหมวดหมู่ซ้ำหรือไม่
        const existingCategory = yield prisma.categories.findFirst({
            where: { name },
        });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }
        const newCategory = yield prisma.categories.create({
            data: { name },
        });
        res.status(201).json({ success: true, data: newCategory });
    }
    catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ success: false, message: "Error creating category", error: error.message });
    }
});
exports.createCategory = createCategory;
// ✅ GET /api/categories - ดึงรายการหมวดหมู่ทั้งหมด
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma.categories.findMany();
        res.json({ success: true, data: categories });
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ success: false, message: "Error fetching categories", error: error.message });
    }
});
exports.getAllCategories = getAllCategories;
// ✅ DELETE /api/categories/:id - ลบหมวดหมู่
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = Number(req.params.id);
        // ตรวจสอบว่าหมวดหมู่ที่ต้องการลบมีอยู่หรือไม่
        const category = yield prisma.categories.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        yield prisma.categories.delete({
            where: { id: categoryId },
        });
        res.json({ success: true, message: "Category deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ success: false, message: "Error deleting category", error: error.message });
    }
});
exports.deleteCategory = deleteCategory;
