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
exports.deleteCategoryService = exports.getAllCategoriesService = exports.createCategoryService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ✅ สร้างหมวดหมู่ใหม่
const createCategoryService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.categories.create({
        data,
    });
});
exports.createCategoryService = createCategoryService;
// ✅ ดึงรายการหมวดหมู่ทั้งหมด
const getAllCategoriesService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.categories.findMany();
});
exports.getAllCategoriesService = getAllCategoriesService;
// ✅ ลบหมวดหมู่
const deleteCategoryService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.categories.delete({
        where: { id },
    });
});
exports.deleteCategoryService = deleteCategoryService;
