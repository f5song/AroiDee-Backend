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
const nutrition_controller_1 = require("../controllers/nutrition.controller");
const router = express_1.default.Router();
// ✅ POST /api/nutrition - เพิ่มข้อมูลโภชนาการให้สูตรอาหาร
router.post("/", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, nutrition_controller_1.createNutrition)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// ✅ GET /api/nutrition/:recipe_id - ดึงข้อมูลโภชนาการของสูตรอาหาร
router.get("/:recipe_id", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, nutrition_controller_1.getNutritionByRecipeId)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// ✅ PUT /api/nutrition/:id - แก้ไขข้อมูลโภชนาการ
router.put("/:id", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, nutrition_controller_1.updateNutrition)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// ✅ DELETE /api/nutrition/:id - ลบข้อมูลโภชนาการ
router.delete("/:id", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, nutrition_controller_1.deleteNutrition)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
exports.default = router;
