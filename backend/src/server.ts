import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: ["http://localhost:5173", "https://aroi-dee-frontend.vercel.app"],
  credentials: true,
}));


app.use(express.json());

// Routes
import categoriesRoutes from "./routes/categories.routes";
import ingredientsRoutes from "./routes/ingredient.routes";
import nutritionFactsRoutes from "./routes/nutrition.routes";
import recipesRoutes from "./routes/recipe.route";
import usersRoutes from "./routes/user.route";
import savedRecipesRoutes from "./routes/savedRecipes.routes";
import mealsRouter from "./routes/meals.routes";

// Prefix API
app.use("/api/categories", categoriesRoutes);
app.use("/api/ingredients", ingredientsRoutes);
app.use("/api/nutrition-facts", nutritionFactsRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/saved-recipes", savedRecipesRoutes);
app.use("/api/meals", mealsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
