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
exports.deleteShoppingListItemService = exports.updateShoppingListItemService = exports.getShoppingListItemsService = exports.addShoppingListItemService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ✅ เพิ่มวัตถุดิบเข้า Shopping List
const addShoppingListItemService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.shopping_list_items.create({
        data,
    });
});
exports.addShoppingListItemService = addShoppingListItemService;
// ✅ ดึงวัตถุดิบใน Shopping List
const getShoppingListItemsService = (shopping_list_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.shopping_list_items.findMany({
        where: { shopping_list_id },
        include: { ingredients: true }, // ดึงข้อมูลวัตถุดิบมาด้วย
    });
});
exports.getShoppingListItemsService = getShoppingListItemsService;
// ✅ แก้ไขจำนวนวัตถุดิบใน Shopping List
const updateShoppingListItemService = (id, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.shopping_list_items.update({
        where: { id },
        data: { quantity },
    });
});
exports.updateShoppingListItemService = updateShoppingListItemService;
// ✅ ลบวัตถุดิบออกจาก Shopping List
const deleteShoppingListItemService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.shopping_list_items.delete({
        where: { id },
    });
});
exports.deleteShoppingListItemService = deleteShoppingListItemService;
