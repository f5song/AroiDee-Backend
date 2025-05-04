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
exports.getSavedRecipes = exports.unsaveRecipe = exports.saveRecipe = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ✅ API บันทึกสูตรอาหารลงฐานข้อมูล
const saveRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, recipe_id } = req.body;
        console.log("📌 [SAVE] Request received:", { user_id, recipe_id });
        if (!user_id || !recipe_id) {
            return res.status(400).json({ success: false, message: "Missing user_id or recipe_id" });
        }
        const existing = yield prisma.saved_recipes.findFirst({
            where: { user_id, recipe_id },
        });
        if (existing) {
            console.log("⚠️ [SAVE] Recipe already saved:", existing);
            return res.status(400).json({ success: false, message: "Recipe already saved" });
        }
        const saved = yield prisma.saved_recipes.create({
            data: { user_id, recipe_id },
        });
        console.log("✅ [SAVE] Recipe saved successfully:", saved);
        return res.json({ success: true, saved });
    }
    catch (error) {
        console.error("❌ [SAVE] Error saving recipe:", error);
        return res.status(500).json({ success: false, message: "Failed to save recipe" });
    }
});
exports.saveRecipe = saveRecipe;
const unsaveRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, recipe_id } = req.body;
        console.log("📌 [UNSAVE] Request received:", { user_id, recipe_id });
        if (!user_id || !recipe_id) {
            return res.status(400).json({ success: false, message: "Missing user_id or recipe_id" });
        }
        const existing = yield prisma.saved_recipes.findFirst({
            where: { user_id, recipe_id },
        });
        if (!existing) {
            console.log("⚠️ [UNSAVE] Recipe not found:", { user_id, recipe_id });
            return res.status(404).json({ success: false, message: "Recipe not found in saved list" });
        }
        yield prisma.saved_recipes.deleteMany({
            where: { user_id, recipe_id },
        });
        console.log("✅ [UNSAVE] Recipe unsaved successfully:", { user_id, recipe_id });
        return res.json({ success: true, message: "Recipe unsaved successfully" });
    }
    catch (error) {
        console.error("❌ [UNSAVE] Error unsaving recipe:", error);
        return res.status(500).json({ success: false, message: "Failed to unsave recipe" });
    }
});
exports.unsaveRecipe = unsaveRecipe;
// ✅ API ดึงรายการสูตรอาหารที่ผู้ใช้บันทึก
const getSavedRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        if (!user_id) {
            return res.status(400).json({ success: false, message: "Missing user_id" });
        }
        const savedRecipes = yield prisma.saved_recipes.findMany({
            where: { user_id: Number(user_id) },
            include: {
                recipes: {
                    select: {
                        id: true,
                        title: true,
                        image_url: true,
                        cook_time: true,
                        rating: true,
                    },
                },
            },
        });
        // ✅ แปลงข้อมูลให้ส่งไป frontend ได้ถูกต้อง
        const formattedSavedRecipes = savedRecipes.map((saved) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return ({
                recipe_id: (_b = (_a = saved.recipes) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 0,
                title: (_d = (_c = saved.recipes) === null || _c === void 0 ? void 0 : _c.title) !== null && _d !== void 0 ? _d : "Unknown Title",
                image_url: (_f = (_e = saved.recipes) === null || _e === void 0 ? void 0 : _e.image_url) !== null && _f !== void 0 ? _f : "/default-recipe.jpg",
                cook_time: (_h = (_g = saved.recipes) === null || _g === void 0 ? void 0 : _g.cook_time) !== null && _h !== void 0 ? _h : 0,
                rating: (_k = (_j = saved.recipes) === null || _j === void 0 ? void 0 : _j.rating) !== null && _k !== void 0 ? _k : 0,
            });
        });
        return res.json({ success: true, savedRecipes: formattedSavedRecipes });
    }
    catch (error) {
        console.error("Error fetching saved recipes:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch saved recipes" });
    }
});
exports.getSavedRecipes = getSavedRecipes;
