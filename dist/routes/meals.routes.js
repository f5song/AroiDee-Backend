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
// routes/meals.route.ts
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const meals_controller_1 = require("../controllers/meals.controller");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
// POST /api/meals
router.post("/", authMiddleware_1.default, (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, meals_controller_1.createMeal)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
// GET /api/meals/users/:user_id?date=2025-05-02
router.get("/users/:user_id/meals", authMiddleware_1.default, (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, meals_controller_1.getMealsByDate)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
router.get("/:id", authMiddleware_1.default, (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, meals_controller_1.deleteMeal)(req, res);
    }
    catch (error) {
        next(error);
    }
})));
exports.default = router;
