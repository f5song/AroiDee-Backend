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
const shoppingList_controller_1 = require("../controllers/shoppingList.controller");
const router = express_1.default.Router();
// ✅ POST /api/shopping-lists - สร้างรายการซื้อของใหม่
router.post("/", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, shoppingList_controller_1.createShoppingList)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// ✅ GET /api/shopping-lists - ดึงรายการซื้อของทั้งหมด
router.get("/", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, shoppingList_controller_1.getAllShoppingLists)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// ✅ GET /api/shopping-lists/:id - ดึงรายละเอียดของรายการซื้อของ
router.get("/:id", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, shoppingList_controller_1.getShoppingListById)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// ✅ DELETE /api/shopping-lists/:id - ลบรายการซื้อของ
router.delete("/:id", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, shoppingList_controller_1.deleteShoppingList)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
exports.default = router;
