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
const recipe_controller_1 = require("../controllers/recipe.controller");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware")); // ✅ ใช้ Default Import ถ้า Export แบบ `export default`
const router = express_1.default.Router();
// ✅ GET /api/recipes - ดึงรายการสูตรอาหารทั้งหมด (ทุกคนเข้าถึงได้)
router.get("/", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, recipe_controller_1.getAllRecipes)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// ✅ GET /api/recipes/search - ค้นหาสูตรอาหาร (ทุกคนเข้าถึงได้)
router.get("/search", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, recipe_controller_1.searchRecipes)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// ✅ GET /api/recipes/:id - ดึงรายละเอียดสูตรอาหารตาม ID (ทุกคนเข้าถึงได้)
router.get("/:id", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, recipe_controller_1.getRecipeById)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
router.post("/create", authMiddleware_1.default, // ✅ ต้องล็อกอินก่อน
(0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, recipe_controller_1.createRecipe)(req, res);
})));
// ✅ PUT /api/recipes/:id - อัปเดตข้อมูลสูตรอาหาร (ต้องล็อกอินก่อน)
router.put("/:id", authMiddleware_1.default, (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, recipe_controller_1.updateRecipe)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// ✅ DELETE /api/recipes/:id - ลบสูตรอาหาร (ต้องล็อกอินก่อน)
router.delete("/:id", authMiddleware_1.default, (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, recipe_controller_1.deleteRecipe)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// ✅ GET /api/recipes/user/:user_id - ดึงสูตรอาหารของผู้ใช้ (ต้องล็อกอินก่อน)
router.get("/user/:user_id", authMiddleware_1.default, (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, recipe_controller_1.getRecipesByUserId)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
exports.default = router;
