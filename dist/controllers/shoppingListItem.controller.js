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
exports.deleteShoppingListItem = exports.updateShoppingListItem = exports.getShoppingListItems = exports.addShoppingListItem = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ✅ POST /api/shopping-list-items - เพิ่มวัตถุดิบเข้า Shopping List
const addShoppingListItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shopping_list_id, ingredient_id, quantity } = req.body;
        if (!shopping_list_id || !ingredient_id || !quantity) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        const newItem = yield prisma.shopping_list_items.create({
            data: {
                shopping_list_id,
                ingredient_id,
                quantity,
            },
            include: {
                ingredients: true, // รวมข้อมูลวัตถุดิบ
            },
        });
        res.status(201).json({ success: true, data: newItem });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error adding item to shopping list", error: error.message });
    }
});
exports.addShoppingListItem = addShoppingListItem;
// ✅ GET /api/shopping-list-items/:list_id - ดึงวัตถุดิบใน Shopping List
const getShoppingListItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listId = Number(req.params.list_id);
        if (isNaN(listId)) {
            return res.status(400).json({ success: false, message: "Invalid shopping list ID" });
        }
        const items = yield prisma.shopping_list_items.findMany({
            where: { shopping_list_id: listId },
            include: {
                ingredients: true, // ดึงข้อมูล ingredient ของแต่ละรายการ
            },
        });
        res.json({ success: true, data: items });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error fetching shopping list items", error: error.message });
    }
});
exports.getShoppingListItems = getShoppingListItems;
// ✅ PUT /api/shopping-list-items/:id - แก้ไขจำนวนวัตถุดิบใน Shopping List
const updateShoppingListItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = Number(req.params.id);
        const { quantity } = req.body;
        if (isNaN(itemId) || !quantity) {
            return res.status(400).json({ success: false, message: "Invalid item ID or missing quantity" });
        }
        const updatedItem = yield prisma.shopping_list_items.update({
            where: { id: itemId },
            data: { quantity },
        });
        res.json({ success: true, data: updatedItem });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error updating shopping list item", error: error.message });
    }
});
exports.updateShoppingListItem = updateShoppingListItem;
// ✅ DELETE /api/shopping-list-items/:id - ลบวัตถุดิบออกจาก Shopping List
const deleteShoppingListItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = Number(req.params.id);
        if (isNaN(itemId)) {
            return res.status(400).json({ success: false, message: "Invalid item ID" });
        }
        // ตรวจสอบก่อนว่ารายการมีอยู่จริงหรือไม่
        const existingItem = yield prisma.shopping_list_items.findUnique({
            where: { id: itemId },
        });
        if (!existingItem) {
            return res.status(404).json({ success: false, message: "Shopping list item not found" });
        }
        yield prisma.shopping_list_items.delete({
            where: { id: itemId },
        });
        res.json({ success: true, message: "Shopping list item deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error deleting shopping list item", error: error.message });
    }
});
exports.deleteShoppingListItem = deleteShoppingListItem;
