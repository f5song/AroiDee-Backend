import express from "express";
import userRoutes from "./routes/user.route";
import recipeRoutes from "./routes/recipe.route";
import ingredientRoutes from "./routes/ingredient.routes";
import nutritionRoutes from "./routes/nutrition.routes";
import categoryRoutes from "./routes/categories.routes";
import shoppingListRoutes from "./routes/shoppingList.routes";
import shoppingListItemRoutes from "./routes/shoppingListItem.routes";


const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/shopping-lists", shoppingListRoutes);
app.use("/api/shopping-list-items", shoppingListItemRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});


