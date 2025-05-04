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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const categories_controller_1 = require("../controllers/categories.controller");
const router = express_1.default.Router();
// ✅ GET /api/categories - ดึงรายการหมวดหมู่ทั้งหมด
router.get("/", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, categories_controller_1.getAllCategories)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// ✅ POST /api/categories - สร้างหมวดหมู่ใหม่
router.post("/", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, categories_controller_1.createCategory)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// ✅ DELETE /api/categories/:id - ลบหมวดหมู่
router.delete("/:id", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, categories_controller_1.deleteCategory)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
exports.default = router;
