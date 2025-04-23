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
exports.deleteRecipe = exports.updateRecipe = exports.searchRecipes = exports.getRecipeById = exports.getAllRecipes = exports.createRecipe = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createRecipe = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.recipes.create({ data });
});
exports.createRecipe = createRecipe;
const getAllRecipes = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.recipes.findMany();
});
exports.getAllRecipes = getAllRecipes;
const getRecipeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.recipes.findUnique({
        where: { id },
        include: { recipe_ingredients: true, nutrition_facts: true },
    });
});
exports.getRecipeById = getRecipeById;
const searchRecipes = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.recipes.findMany({
        where: {
            title: filters.title ? { contains: filters.title } : undefined,
            category_id: filters.category,
            recipe_ingredients: filters.ingredient
                ? { some: { ingredients: { name: { contains: filters.ingredient } } } }
                : undefined,
        },
    });
});
exports.searchRecipes = searchRecipes;
const updateRecipe = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.recipes.update({ where: { id }, data });
});
exports.updateRecipe = updateRecipe;
const deleteRecipe = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.recipes.delete({ where: { id } });
});
exports.deleteRecipe = deleteRecipe;
