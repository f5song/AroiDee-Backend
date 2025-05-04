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
exports.deleteShoppingListService = exports.getShoppingListByIdService = exports.getAllShoppingListsService = exports.createShoppingListService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ✅ สร้างรายการซื้อของใหม่
const createShoppingListService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.shopping_lists.create({
        data,
    });
});
exports.createShoppingListService = createShoppingListService;
// ✅ ดึงรายการซื้อของทั้งหมดของผู้ใช้
const getAllShoppingListsService = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.shopping_lists.findMany({
        where: { user_id },
        include: { shopping_list_items: true }, // ดึงรายการวัตถุดิบในลิสต์มาด้วย
    });
});
exports.getAllShoppingListsService = getAllShoppingListsService;
// ✅ ดึงรายละเอียดของรายการซื้อของ
const getShoppingListByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.shopping_lists.findUnique({
        where: { id },
        include: { shopping_list_items: true },
    });
});
exports.getShoppingListByIdService = getShoppingListByIdService;
// ✅ ลบรายการซื้อของ
const deleteShoppingListService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.shopping_lists.delete({
        where: { id },
    });
});
exports.deleteShoppingListService = deleteShoppingListService;
