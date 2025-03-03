import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173", // แก้เป็น frontend URL ที่ deploy แล้ว
  credentials: true
}));

app.use(express.json());

app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "Backend Connected to Frontend with TypeScript!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
