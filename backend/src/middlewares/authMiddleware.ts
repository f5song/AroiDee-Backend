import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

if (!SECRET_KEY) {
  throw new Error("❌ JWT_SECRET is not set in environment variables!");
}

export interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string };
}

const authMiddleware: RequestHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ success: false, message: "Access Denied. No token provided." });
      return;
    }

    // ถอดรหัส JWT token
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: number; email: string };
    
    // เพิ่มข้อมูลผู้ใช้ลงใน request object
    req.user = { id: decoded.userId, email: decoded.email };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token." });
  }
};

export default authMiddleware;