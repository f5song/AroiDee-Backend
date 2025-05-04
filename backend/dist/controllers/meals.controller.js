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
exports.deleteMeal = exports.getMealsByDate = exports.createMeal = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createMeal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { recipe_id, date, category_id } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const missingFields = [];
    if (!userId)
        missingFields.push("user_id");
    if (!recipe_id)
        missingFields.push("recipe_id");
    if (!date)
        missingFields.push("date");
    if (!category_id)
        missingFields.push("category_id");
    if (missingFields.length > 0) {
        return res.status(400).json({
            message: "Missing required fields",
            missing: missingFields,
        });
    }
    try {
        const meal = yield prisma.meals.create({
            data: {
                user_id: userId, // ✅ บอกชัดเจนว่าเป็น number แน่นอน
                recipe_id,
                date: new Date(date),
                category_id,
            },
            include: {
                recipe: true,
            },
        });
        return res.status(201).json(meal);
    }
    catch (error) {
        console.error("Error creating meal:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.createMeal = createMeal;
// Update the getMealsByDate function to accept query parameters
const getMealsByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { date } = req.query;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    if (!date)
        return res.status(400).json({ message: "Date is required" });
    try {
        const meals = yield prisma.meals.findMany({
            where: {
                user_id: userId,
                date: {
                    gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
                    lte: new Date(new Date(date).setHours(23, 59, 59, 999)),
                },
            },
            include: {
                recipe: {
                    include: {
                        nutrition_facts: true,
                    },
                },
            },
            orderBy: {
                category_id: "asc",
            },
        });
        return res.status(200).json(meals);
    }
    catch (error) {
        console.error("Get meals error:", error);
        return res.status(500).json({ message: "Internal error" });
    }
});
exports.getMealsByDate = getMealsByDate;
// Add this function to handle meal deletion
const deleteMeal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const mealId = Number.parseInt(req.params.id);
    if (!userId || isNaN(mealId)) {
        return res.status(400).json({ message: "Invalid request" });
    }
    try {
        // First check if the meal belongs to the user
        const meal = yield prisma.meals.findFirst({
            where: {
                id: mealId,
                user_id: userId,
            },
        });
        if (!meal) {
            return res
                .status(404)
                .json({ message: "Meal not found or not authorized" });
        }
        // Delete the meal
        yield prisma.meals.delete({
            where: {
                id: mealId,
            },
        });
        return res.status(200).json({ message: "Meal deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting meal:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteMeal = deleteMeal;
