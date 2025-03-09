import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthenticatedRequest } from "../middlewares/authMiddleware"; // ✅ เปลี่ยนจาก AuthRequest เป็น AuthenticatedRequest

import { createToken } from "../utils/auth"; // ✅ Import ฟังก์ชันสร้าง Token

const prisma = new PrismaClient();
const saltRounds = 10; // สำหรับ hash รหัสผ่าน

// ✅ GET /api/users - ดึงข้อมูลผู้ใช้ทั้งหมด
export const fetchUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
      },
    });

    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
  }
};

// ✅ POST /api/users/register - ลงทะเบียนผู้ใช้ใหม่
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    // ตรวจสอบว่ามีอีเมลนี้อยู่แล้วหรือไม่
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ success: false, message: "Email already registered" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        password_hash: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
      },
    });

    res.status(201).json({ success: true, message: "User registered successfully", user: newUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error registering user", error: error.message });
  }
};


// ✅ GET /api/users/profile - ดึงข้อมูลโปรไฟล์ของผู้ใช้ที่ล็อกอิน
export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authorized" });
      return;
    }

    const userProfile = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
      },
    });

    if (!userProfile) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, user: userProfile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching profile", error: error.message });
  }
};


// ✅ PUT /api/users/profile - อัปเดตข้อมูลโปรไฟล์
export const updateUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { username, email } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: "Not authorized" });
      return;
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { username, email },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    res.json({ success: true, message: "User updated successfully", user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error updating profile", error: error.message });
  }
};

// ✅ DELETE /api/users/:id - ลบผู้ใช้
export const deleteUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      res.status(400).json({ success: false, message: "Invalid user ID user ja" });
      return;
    }

    const existingUser = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    await prisma.users.delete({
      where: { id: userId },
    });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error deleting user", error: error.message });
  }
};


// POST /api/login - เข้าสู่ระบบผู้ใช้

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "กรุณากรอกอีเมลและรหัสผ่าน" });
      return;
    }

    // ✅ ค้นหาผู้ใช้ในฐานข้อมูล (ไม่มี `role`)
    const user = await prisma.users.findUnique({
      where: { email },
      select: { id: true, username: true, email: true, password_hash: true }, // ✅ เพิ่ม password_hash
    });    

    if (!user) {
      res.status(401).json({ success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
      return;
    }

    // ✅ ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
      return;
    }

    // ✅ ลบ `role` ออกจาก JWT Token
    const token = createToken({ id: user.id, email: user.email });

    res.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ", error: error.message });
  }
};


