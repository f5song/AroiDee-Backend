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
exports.deleteRecipe = exports.updateRecipe = exports.searchRecipes = exports.getRecipesByUserId = exports.getRecipeById = exports.getAllRecipes = exports.createRecipe = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ✅ POST /api/recipes - สร้างสูตรอาหารใหม่
const createRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        const { user_id, category_id, title, description, instructions, image_url, cook_time, ingredients, nutrition_facts } = req.body;
        // ✅ ตรวจสอบค่าที่จำเป็น
        if (!user_id || !title || !instructions || !ingredients) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: user_id, title, instructions, ingredients",
            });
        }
        // ✅ แปลง JSON และตรวจสอบข้อผิดพลาด
        let parsedInstructions = [];
        let parsedIngredients = [];
        try {
            parsedInstructions = Array.isArray(instructions)
                ? instructions
                : JSON.parse(instructions);
        }
        catch (error) {
            return res.status(400).json({ success: false, message: "Invalid instructions format" });
        }
        try {
            parsedIngredients = Array.isArray(ingredients)
                ? ingredients
                : JSON.parse(ingredients);
        }
        catch (error) {
            return res.status(400).json({ success: false, message: "Invalid ingredients format" });
        }
        // ✅ บันทึกสูตรอาหารลงในฐานข้อมูล
        const newRecipe = yield prisma.recipes.create({
            data: {
                user_id,
                category_id: category_id || null,
                title,
                description: description || "",
                instructions: parsedInstructions, // ✅ บันทึก instructions เป็น JSON Array
                image_url: image_url || null,
                cook_time: cook_time || 0,
                // ✅ บันทึก Nutrition Facts (ถ้ามี)
                nutrition_facts: nutrition_facts
                    ? {
                        create: {
                            calories: (_a = nutrition_facts.calories) !== null && _a !== void 0 ? _a : 0,
                            total_fat: (_b = nutrition_facts.total_fat) !== null && _b !== void 0 ? _b : 0,
                            saturated_fat: (_c = nutrition_facts.saturated_fat) !== null && _c !== void 0 ? _c : 0,
                            cholesterol: (_d = nutrition_facts.cholesterol) !== null && _d !== void 0 ? _d : 0,
                            sodium: (_e = nutrition_facts.sodium) !== null && _e !== void 0 ? _e : 0,
                            potassium: (_f = nutrition_facts.potassium) !== null && _f !== void 0 ? _f : 0,
                            total_carbohydrate: (_g = nutrition_facts.total_carbohydrate) !== null && _g !== void 0 ? _g : 0,
                            sugars: (_h = nutrition_facts.sugars) !== null && _h !== void 0 ? _h : 0,
                            protein: (_j = nutrition_facts.protein) !== null && _j !== void 0 ? _j : 0,
                        },
                    }
                    : undefined,
                // ✅ บันทึก Ingredients (ใช้ connectOrCreate เพื่อป้องกันซ้ำ)
                recipe_ingredients: parsedIngredients.length > 0
                    ? {
                        create: parsedIngredients.map((ingredient) => ({
                            quantity: ingredient.amount,
                            ingredients: {
                                connectOrCreate: {
                                    where: { name: ingredient.name },
                                    create: { name: ingredient.name, unit: ingredient.unit },
                                },
                            },
                        })),
                    }
                    : undefined,
                // ✅ บันทึก Categories (ถ้ามี)
                recipe_categories: category_id
                    ? {
                        create: [{ category: { connect: { id: category_id } } }],
                    }
                    : undefined,
            },
        });
        res.status(201).json({
            success: true,
            message: "Recipe created successfully",
            recipe: newRecipe,
        });
    }
    catch (error) {
        console.error("❌ Error creating recipe:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});
exports.createRecipe = createRecipe;
// ✅ GET /api/recipes - รองรับ sort=calories-low และ calories-high
const getAllRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sort, category } = req.query;
        // กำหนดค่าเริ่มต้นของ orderBy และ where
        let orderBy = { created_at: "desc" }; // ค่าเริ่มต้น: ใหม่ไปเก่า
        let sortedRecipeIds = undefined; // สำหรับการเรียง calories แบบ optimized
        let where = {};
        // หากมี category filter (และไม่ใช่ "all") ให้เพิ่มเงื่อนไขใน where
        if (category && category !== "all") {
            where.recipe_categories = {
                some: {
                    category: {
                        name: { equals: category, mode: "insensitive" },
                    },
                },
            };
        }
        // กำหนด orderBy สำหรับ sort แบบอื่นๆ
        if (sort === "oldest")
            orderBy = { created_at: "asc" };
        if (sort === "rating")
            orderBy = { rating: "desc" };
        if (sort === "cooking-time")
            orderBy = { cook_time: "asc" };
        if (sort === "name-asc")
            orderBy = { title: "asc" };
        if (sort === "name-desc")
            orderBy = { title: "desc" };
        // สำหรับการ sort แบบ calories
        if (sort === "calories-low" || sort === "calories-high") {
            // หากไม่มี category filter (หรือเลือก "all") ให้ใช้ query แบบ optimized
            if (!category || category === "all") {
                const sortOrder = sort === "calories-low" ? "asc" : "desc";
                const sortedRecipes = yield prisma.nutrition_facts.findMany({
                    select: { recipe_id: true },
                    orderBy: { calories: sortOrder },
                });
                sortedRecipeIds = sortedRecipes
                    .map((r) => r.recipe_id)
                    .filter((id) => id !== null);
                // เมื่อใช้ sortedRecipeIds แล้ว จะไม่ส่ง orderBy ไปใน query หลัก
                orderBy = undefined;
            }
            else {
                // หากมี category filter เราไม่สามารถใช้ sortedRecipeIds แบบ optimized ได้
                // ให้ปล่อย orderBy เป็น undefined และทำการ sort ใน JS ภายหลัง
                orderBy = undefined;
            }
        }
        // Query สูตรอาหาร โดยนำ where condition มารวมกับ sortedRecipeIds (ถ้ามี)
        const recipes = yield prisma.recipes.findMany({
            where: sortedRecipeIds ? Object.assign(Object.assign({}, where), { id: { in: sortedRecipeIds } }) : where,
            include: {
                user: { select: { username: true } },
                recipe_categories: { include: { category: { select: { name: true } } } },
                recipe_ingredients: { include: { ingredients: { select: { name: true } } } },
                nutrition_facts: { select: { calories: true } },
            },
            orderBy: sortedRecipeIds ? undefined : orderBy,
        });
        // แปลงข้อมูลให้ frontend ใช้งานง่าย
        let formattedRecipes = recipes.map((recipe) => {
            var _a, _b, _c, _d, _e, _f;
            return ({
                id: recipe.id,
                title: recipe.title,
                author: ((_a = recipe.user) === null || _a === void 0 ? void 0 : _a.username) || "Unknown",
                image_url: recipe.image_url || "/default-recipe.jpg",
                cook_time: recipe.cook_time || 0,
                calories: ((_c = (_b = recipe.nutrition_facts) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.calories)
                    ? Number(recipe.nutrition_facts[0].calories)
                    : 0,
                rating: (_d = recipe.rating) !== null && _d !== void 0 ? _d : 0,
                categories: ((_e = recipe.recipe_categories) === null || _e === void 0 ? void 0 : _e.map((rc) => rc.category.name)) || [],
                ingredients: ((_f = recipe.recipe_ingredients) === null || _f === void 0 ? void 0 : _f.map((ri) => { var _a; return ((_a = ri.ingredients) === null || _a === void 0 ? void 0 : _a.name) || "Unknown"; })) || [],
            });
        });
        // ถ้า sort เป็น calories-low หรือ calories-high ให้ทำการเรียงลำดับอีกครั้งใน JS
        if (sort === "calories-low") {
            formattedRecipes.sort((a, b) => a.calories - b.calories);
        }
        if (sort === "calories-high") {
            formattedRecipes.sort((a, b) => b.calories - a.calories);
        }
        res.json({ success: true, data: formattedRecipes });
    }
    catch (error) {
        console.error("❌ Error fetching recipes:", error);
    }
});
exports.getAllRecipes = getAllRecipes;
const getRecipeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    try {
        console.log("🔍 Recipe ID from request:", req.params.id); // ✅ Debug
        const recipeId = Number(req.params.id);
        if (isNaN(recipeId)) {
            return res.status(400).json({ success: false, message: "Invalid recipe ID" });
        }
        // ✅ ดึงข้อมูลจากฐานข้อมูล พร้อมดึง `users` (ผู้สร้างสูตร)
        const recipe = yield prisma.recipes.findUnique({
            where: { id: recipeId },
            include: {
                user: {
                    select: { id: true, username: true }, // ดึงเฉพาะ `id` และ `username`
                },
                nutrition_facts: true, // ✅ ดึงข้อมูลโภชนาการ
                recipe_categories: {
                    include: { category: true }, // ✅ ดึงหมวดหมู่
                },
                recipe_ingredients: {
                    include: { ingredients: true }, // ✅ ดึงส่วนผสม
                },
            },
        });
        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe not found" });
        }
        // ✅ ตรวจสอบและแปลง `instructions` เป็น `string[]`
        const parsedInstructions = Array.isArray(recipe.instructions)
            ? recipe.instructions
            : [];
        // ✅ ตรวจสอบว่า `nutrition_facts` มีค่าก่อนเข้าถึง
        const nutrition = ((_a = recipe.nutrition_facts) === null || _a === void 0 ? void 0 : _a[0]) || null;
        // ✅ แปลงข้อมูลให้ frontend ใช้งานง่ายขึ้น
        const formattedRecipe = {
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            instructions: parsedInstructions, // ✅ ใช้ค่าที่ parse แล้ว
            image_url: recipe.image_url,
            cook_time: recipe.cook_time,
            rating: recipe.rating,
            created_at: recipe.created_at,
            // ✅ เพิ่มข้อมูลผู้สร้างสูตรอาหาร
            author: {
                id: (_c = (_b = recipe.user) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : null,
                username: (_e = (_d = recipe.user) === null || _d === void 0 ? void 0 : _d.username) !== null && _e !== void 0 ? _e : "Unknown", // ถ้าไม่มี username ให้แสดง "Unknown"
            },
            // ✅ ดึงค่าจาก `nutrition_facts`
            nutrition_facts: nutrition
                ? {
                    calories: (_f = nutrition.calories) !== null && _f !== void 0 ? _f : null,
                    total_fat: (_g = nutrition.total_fat) !== null && _g !== void 0 ? _g : null,
                    saturated_fat: (_h = nutrition.saturated_fat) !== null && _h !== void 0 ? _h : null,
                    cholesterol: (_j = nutrition.cholesterol) !== null && _j !== void 0 ? _j : null,
                    sodium: (_k = nutrition.sodium) !== null && _k !== void 0 ? _k : null,
                    potassium: (_l = nutrition.potassium) !== null && _l !== void 0 ? _l : null,
                    total_carbohydrate: (_m = nutrition.total_carbohydrate) !== null && _m !== void 0 ? _m : null,
                    sugars: (_o = nutrition.sugars) !== null && _o !== void 0 ? _o : null,
                    protein: (_p = nutrition.protein) !== null && _p !== void 0 ? _p : null,
                }
                : null,
            // ✅ ดึงหมวดหมู่ (categories)
            categories: recipe.recipe_categories.map(rc => ({
                id: rc.category.id,
                name: rc.category.name,
                image_url: rc.category.image_url,
            })),
            // ✅ ดึง ingredients และป้องกัน errors
            ingredients: recipe.recipe_ingredients.map(ri => {
                var _a, _b, _c, _d, _e, _f, _g;
                return ({
                    id: (_b = (_a = ri.ingredients) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
                    name: (_d = (_c = ri.ingredients) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "Unknown",
                    unit: (_f = (_e = ri.ingredients) === null || _e === void 0 ? void 0 : _e.unit) !== null && _f !== void 0 ? _f : "",
                    quantity: (_g = ri.quantity) !== null && _g !== void 0 ? _g : 0,
                });
            }),
        };
        res.status(200).json({ success: true, data: formattedRecipe });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error fetching recipe", error: error.message });
    }
});
exports.getRecipeById = getRecipeById;
/**
 * ✅ ดึงสูตรอาหารทั้งหมดของผู้ใช้ที่ล็อกอิน
 * @route GET /api/recipes/user/:user_id
 */
const getRecipesByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("🔍 User ID from request:", req.params.user_id); // ✅ Debug
        const userId = Number(req.params.user_id);
        if (isNaN(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }
        // ✅ ดึงข้อมูลสูตรอาหารที่ user เป็นเจ้าของ
        const recipes = yield prisma.recipes.findMany({
            where: { user_id: userId },
            include: {
                nutrition_facts: true, // ✅ ดึงข้อมูลโภชนาการ
                recipe_categories: {
                    include: { category: true }, // ✅ ดึงหมวดหมู่
                },
                recipe_ingredients: {
                    include: { ingredients: true }, // ✅ ดึงส่วนผสม
                },
            },
            orderBy: { created_at: "desc" }, // ✅ เรียงลำดับจากใหม่ไปเก่า
        });
        if (!recipes.length) {
            return res.status(404).json({ success: false, message: "No recipes found for this user" });
        }
        // ✅ แปลงข้อมูลให้ frontend ใช้งานง่ายขึ้น
        const formattedRecipes = recipes.map((recipe) => {
            var _a, _b, _c, _d, _e;
            return ({
                id: recipe.id,
                title: recipe.title,
                description: recipe.description,
                instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
                image_url: recipe.image_url,
                cook_time: recipe.cook_time,
                rating: recipe.rating,
                created_at: recipe.created_at,
                // ✅ ดึงค่าจาก `nutrition_facts`
                calories: (_c = (_b = (_a = recipe.nutrition_facts) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.calories) !== null && _c !== void 0 ? _c : null, // ✅ ดึง calories
                nutrition_facts: (_e = (_d = recipe.nutrition_facts) === null || _d === void 0 ? void 0 : _d[0]) !== null && _e !== void 0 ? _e : null, // ✅ ดึงโภชนาการทั้งหมด
                // ✅ ดึงหมวดหมู่ (categories)
                categories: recipe.recipe_categories.map((rc) => ({
                    id: rc.category.id,
                    name: rc.category.name,
                    image_url: rc.category.image_url,
                })),
                // ✅ ดึง ingredients และป้องกัน errors
                ingredients: recipe.recipe_ingredients.map((ri) => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    return ({
                        id: (_b = (_a = ri.ingredients) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
                        name: (_d = (_c = ri.ingredients) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "Unknown",
                        unit: (_f = (_e = ri.ingredients) === null || _e === void 0 ? void 0 : _e.unit) !== null && _f !== void 0 ? _f : "",
                        quantity: (_g = ri.quantity) !== null && _g !== void 0 ? _g : 0,
                    });
                }),
            });
        });
        res.status(200).json({ success: true, data: formattedRecipes });
    }
    catch (error) {
        console.error("Error fetching user recipes:", error);
        res.status(500).json({ success: false, message: "Error fetching user recipes", error: error.message });
    }
});
exports.getRecipesByUserId = getRecipesByUserId;
// ✅ GET /api/recipes/search?title=...&category=...&ingredient=...
const searchRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = {};
        if (req.query.title) {
            filters.title = { contains: String(req.query.title), mode: "insensitive" };
        }
        if (req.query.category) {
            filters.category_id = Number(req.query.category);
        }
        if (req.query.ingredient) {
            filters.recipe_ingredients = {
                some: {
                    ingredients: {
                        name: { contains: String(req.query.ingredient), mode: "insensitive" },
                    },
                },
            };
        }
        const recipes = yield prisma.recipes.findMany({
            where: filters,
            include: {
                categories: true,
                recipe_ingredients: {
                    include: {
                        ingredients: true,
                    },
                },
            },
        });
        res.json({ success: true, data: recipes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error searching recipes", error: error.message });
    }
});
exports.searchRecipes = searchRecipes;
// ✅ PUT /api/recipes/:id - อัปเดตข้อมูลสูตรอาหาร
const updateRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedRecipe = yield prisma.recipes.update({
            where: { id: Number(req.params.id) },
            data: req.body, // ตรวจสอบให้แน่ใจว่ามีค่าที่จะอัปเดต
        });
        res.json({ success: true, data: updatedRecipe });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error updating recipe", error: error.message });
    }
});
exports.updateRecipe = updateRecipe;
// ✅ DELETE /api/recipes/:id - ลบสูตรอาหาร
const deleteRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.recipes.delete({
            where: { id: Number(req.params.id) },
        });
        res.json({ success: true, message: "Recipe deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error deleting recipe", error: error.message });
    }
});
exports.deleteRecipe = deleteRecipe;
