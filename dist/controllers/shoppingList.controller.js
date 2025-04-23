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
exports.deleteShoppingList = exports.getShoppingListById = exports.getAllShoppingLists = exports.createShoppingList = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ✅ POST /api/shopping-lists - สร้างรายการซื้อของใหม่
const createShoppingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const newList = yield prisma.shopping_lists.create({
            data: {
                user_id,
            },
            include: {
                shopping_list_items: true, // รวมรายการสินค้าใน shopping list
            },
        });
        res.status(201).json({ success: true, data: newList });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error creating shopping list", error: error.message });
    }
});
exports.createShoppingList = createShoppingList;
// ✅ GET /api/shopping-lists - ดึงรายการซื้อของทั้งหมดของผู้ใช้
const getAllShoppingLists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("✅ Received request at /api/shopping-lists", req.query);
        const userId = req.query.user_id ? Number(req.query.user_id) : null;
        if (!userId || isNaN(userId)) {
            console.log("❌ Invalid user ID shoplist:", req.query.user_id);
            return res.json({ success: false, message: "No shopping lists found" }); // ✅ เปลี่ยนจาก error เป็น success=false
        }
        const lists = yield prisma.shopping_lists.findMany({
            where: { user_id: userId },
            include: { shopping_list_items: { include: { ingredients: true } } },
        });
        res.json({ success: true, data: lists });
    }
    catch (error) {
        console.error("❌ Error fetching shopping lists:", error);
        res.status(500).json({ success: false, message: "Error fetching shopping lists", error: error.message });
    }
});
exports.getAllShoppingLists = getAllShoppingLists;
// ✅ GET /api/shopping-lists/:id - ดึงรายละเอียดของรายการซื้อของ
const getShoppingListById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listId = Number(req.params.id);
        if (isNaN(listId)) {
            return res.status(400).json({ success: false, message: "Invalid shopping list ID" });
        }
        const list = yield prisma.shopping_lists.findUnique({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error fetching shopping list", error: error.message });
    }
});
exports.getShoppingListById = getShoppingListById;
// ✅ DELETE /api/shopping-lists/:id - ลบรายการซื้อของ
const deleteShoppingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listId = Number(req.params.id);
        if (isNaN(listId)) {
            return res.status(400).json({ success: false, message: "Invalid shopping list ID" });
        }
        // ตรวจสอบก่อนว่ารายการมีอยู่จริงหรือไม่
        const existingList = yield prisma.shopping_lists.findUnique({
            where: { id: listId },
        });
        if (!existingList) {
            return res.status(404).json({ success: false, message: "Shopping list not found" });
        }
        yield prisma.shopping_lists.delete({
            where: { id: listId },
        });
        res.json({ success: true, message: "Shopping list deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error deleting shopping list", error: error.message });
    }
});
exports.deleteShoppingList = deleteShoppingList;
