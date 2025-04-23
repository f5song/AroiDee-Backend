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
exports.deleteIngredient = exports.updateIngredient = exports.getIngredientById = exports.getAllIngredients = exports.createIngredient = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createIngredient = (name, unit) => __awaiter(void 0, void 0, void 0, function* () {
    const existingIngredient = yield prisma.ingredients.findUnique({ where: { name } });
    if (existingIngredient)
        throw new Error("Ingredient already exists");
    return yield prisma.ingredients.create({ data: { name, unit } });
});
exports.createIngredient = createIngredient;
const getAllIngredients = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.ingredients.findMany();
});
exports.getAllIngredients = getAllIngredients;
const getIngredientById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const ingredient = yield prisma.ingredients.findUnique({ where: { id } });
    if (!ingredient)
        throw new Error("Ingredient not found");
    return ingredient;
});
exports.getIngredientById = getIngredientById;
const updateIngredient = (id, name, unit) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.ingredients.update({
        where: { id },
        data: { name, unit },
    });
});
exports.updateIngredient = updateIngredient;
const deleteIngredient = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.ingredients.delete({ where: { id } });
});
exports.deleteIngredient = deleteIngredient;
