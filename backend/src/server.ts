import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import categoriesRoutes from "./routes/categories.routes";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: "https://aroi-dee-frontend.vercel.app",
  credentials: true
}));

app.use(express.json());
app.use("/api/categories", categoriesRoutes);



app.get("/api/test", (req, res) => {
  res.json({ message: "Backend Connected to Frontend with TypeScript!" });
});

app.get("/api/db-test", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ message: "Database Connected!" });
  } catch (error) {
    console.error("Database Connection Error:", error);
    res.status(500).json({ error: "Database Connection Failed" });
  }
});

export default app;
