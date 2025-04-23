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
const express_async_handler_1 = __importDefault(require("express-async-handler")); // ใช้ asyncHandler สำหรับการจัดการ asynchronous functions
const savedRecipes_controller_1 = require("../controllers/savedRecipes.controller"); // ตรวจสอบว่า import ถูกต้อง
const router = express_1.default.Router();
// ใช้ express.json() สำหรับ request body
router.use(express_1.default.json());
// ✅ API สำหรับบันทึกสูตรอาหาร
router.post("/save-recipe", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, savedRecipes_controller_1.saveRecipe)(req, res);
    }
    catch (error) {
        next(error); // ถ้ามี error จะถูกส่งต่อไปยัง middleware ที่ใช้จัดการ error
    }
})));
// ✅ API สำหรับยกเลิกการบันทึกสูตรอาหาร
router.post("/unsave-recipe", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, savedRecipes_controller_1.unsaveRecipe)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// ✅ API สำหรับดึงรายการสูตรที่ผู้ใช้บันทึก
router.get("/:user_id/saved-recipes", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, savedRecipes_controller_1.getSavedRecipes)(req, res);
    }
    catch (error) {
        next(error); // ส่ง error ไปที่ next
    }
})));
exports.default = router;
