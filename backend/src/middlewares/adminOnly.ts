import { NextFunction, Response } from "express";
import { AuthRequest } from "./authMiddleware";

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // ตรวจสอบสิทธิ์ผู้ใช้
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ success: false, message: "Access denied: Admins only" });
    return;
  }

  next();
};
