import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import all route files
import categoriesRoutes from "./routes/categories.routes";
import ingredientsRoutes from "./routes/ingredient.routes";
import nutritionFactsRoutes from "./routes/nutrition.routes";
import recipesRoutes from "./routes/recipe.route";
import shoppingListItemsRoutes from "./routes/shoppingListItem.routes";
import shoppingListsRoutes from "./routes/shoppingList.routes";
import usersRoutes from "./routes/user.route";
import savedRecipesRoutes from "./routes/savedRecipes.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - อัปเดตให้รองรับ localhost:5173
app.use(cors({
  origin: ["https://aroi-dee-frontend.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Add prefix `/api` to all routes
app.use("/api/categories", categoriesRoutes);
app.use("/api/ingredients", ingredientsRoutes);
app.use("/api/nutrition-facts", nutritionFactsRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/shopping-list-items", shoppingListItemsRoutes);
app.use("/api/shopping-lists", shoppingListsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/saved-recipes", savedRecipesRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});