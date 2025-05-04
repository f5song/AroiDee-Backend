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
const shoppingListItem_controller_1 = require("../controllers/shoppingListItem.controller");
const router = express_1.default.Router();
// ✅ POST /api/shopping-list-items - เพิ่มวัตถุดิบเข้า Shopping List
router.post("/", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, shoppingListItem_controller_1.addShoppingListItem)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// ✅ GET /api/shopping-list-items/:list_id - ดึงวัตถุดิบใน Shopping List
router.get("/:list_id", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, shoppingListItem_controller_1.getShoppingListItems)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// ✅ PUT /api/shopping-list-items/:id - แก้ไขจำนวนวัตถุดิบใน Shopping List
router.put("/:id", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, shoppingListItem_controller_1.updateShoppingListItem)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// ✅ DELETE /api/shopping-list-items/:id - ลบวัตถุดิบออกจาก Shopping List
router.delete("/:id", (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, shoppingListItem_controller_1.deleteShoppingListItem)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
exports.default = router;
