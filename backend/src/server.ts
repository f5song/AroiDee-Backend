import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: "https://aroi-dee-frontend.vercel.app",
  credentials: true
}));

app.use(express.json());

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

app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await prisma.recipes.findMany();
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});



export default app;
