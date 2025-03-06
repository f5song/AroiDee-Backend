import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

if (!SECRET_KEY) {
  throw new Error("❌ JWT_SECRET is not set in environment variables!");
}

export interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string };
}

// ✅ ใช้ `RequestHandler` และ `void`
const authMiddleware: RequestHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ success: false, message: "Access Denied. No token provided." });
      return; // ✅ ต้องมี `return` หลังจากส่ง response
    }

    const decoded = jwt.verify(token, SECRET_KEY) as { userId: number; email: string };
    req.user = { id: decoded.userId, email: decoded.email };

    next(); // ✅ ต้องเรียก `next()` เสมอ
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token." });
  }
};

export default authMiddleware;
