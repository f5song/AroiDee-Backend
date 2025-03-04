import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      res.status(401).json({ success: false, message: "Not authorized, no token" });
      return;
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("Decoded Token:", decoded);

    if (!decoded || !decoded.id) {
      res.status(401).json({ success: false, message: "Invalid token structure" });
      return;
    }

    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, email: true },
    });

    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};
