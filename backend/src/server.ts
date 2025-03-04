import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "https://aroi-dee-frontend.vercel.app", // ✅ ลบ `/` ท้าย URL
  credentials: true
}));

app.use(express.json());

app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "Backend Connected to Frontend with TypeScript!" });
});

// ✅ เปลี่ยนจาก `app.listen` เป็น `export default`
export default app;
