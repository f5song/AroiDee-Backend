import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: "https://aroi-dee-frontend.vercel.app", // ✅ แก้ให้ตรงกับ URL ของ Frontend ที่ Deploy แล้ว
  credentials: true
}));

app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend Connected to Frontend with TypeScript!" });
});

export default app;
