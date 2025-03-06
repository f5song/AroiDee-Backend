import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

if (!SECRET_KEY) {
  throw new Error("❌ JWT_SECRET is not set in environment variables!");
}

// ✅ สร้าง Interface Request ที่รองรับ `user`
export interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string };
}

export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: number; email: string };
    req.user = { id: decoded.userId, email: decoded.email }; // ✅ เพิ่ม `user` ลงใน `req`
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token." });
  }
};
