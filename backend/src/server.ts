import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoriesRoutes from "./routes/categories.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ เพิ่ม prefix `/api` สำหรับทุก routes
app.use("/api", categoriesRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
