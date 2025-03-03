import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Not authorized, no token" });
      return;
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, email: true }, // เลือกเฉพาะข้อมูลที่ต้องใช้
    });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user; // ส่ง user ไปใน request object
    next(); // ไป middleware ถัดไป

  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
