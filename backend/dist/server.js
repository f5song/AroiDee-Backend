"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://aroi-dee-frontend.vercel.app"],
    credentials: true,
}));
app.use(express_1.default.json());
// Routes
const categories_routes_1 = __importDefault(require("./routes/categories.routes"));
const ingredient_routes_1 = __importDefault(require("./routes/ingredient.routes"));
const nutrition_routes_1 = __importDefault(require("./routes/nutrition.routes"));
const recipe_route_1 = __importDefault(require("./routes/recipe.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const savedRecipes_routes_1 = __importDefault(require("./routes/savedRecipes.routes"));
const meals_routes_1 = __importDefault(require("./routes/meals.routes"));
// Prefix API
app.use("/api/categories", categories_routes_1.default);
app.use("/api/ingredients", ingredient_routes_1.default);
app.use("/api/nutrition-facts", nutrition_routes_1.default);
app.use("/api/recipes", recipe_route_1.default);
app.use("/api/users", user_route_1.default);
app.use("/api/saved-recipes", savedRecipes_routes_1.default);
app.use("/api/meals", meals_routes_1.default);
// Start server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
