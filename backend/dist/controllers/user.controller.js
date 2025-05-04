"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCalorieGoal = exports.uploadAvatar = exports.login = exports.deleteUserById = exports.updateUserProfile = exports.getUserProfile = exports.register = exports.fetchUsers = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../utils/auth"); // ✅ Import ฟังก์ชันสร้าง Token
const prisma = new client_1.PrismaClient();
const saltRounds = 10; // สำหรับ hash รหัสผ่าน
// ✅ GET /api/users - ดึงข้อมูลผู้ใช้ทั้งหมด
const fetchUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.users.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                created_at: true,
            },
        });
        res.json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message,
        });
    }
});
exports.fetchUsers = fetchUsers;
// ✅ POST /api/users/register - ลงทะเบียนผู้ใช้ใหม่
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res
                .status(400)
                .json({ success: false, message: "Missing required fields" });
            return;
        }
        // ตรวจสอบว่ามีอีเมลนี้อยู่แล้วหรือไม่
        const existingUser = yield prisma.users.findUnique({
            where: { email },
        });
        if (existingUser) {
            res
                .status(400)
                .json({ success: false, message: "Email already registered" });
            return;
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const newUser = yield prisma.users.create({
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
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message,
        });
    }
});
exports.register = register;
// ✅ GET /api/users/profile - ดึงข้อมูลโปรไฟล์ของผู้ใช้ที่ล็อกอิน
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Not authorized" });
            return;
        }
        const userProfile = yield prisma.users.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                username: true,
                email: true,
                created_at: true,
                image_url: true,
                calories_goal: true,
            },
        });
        if (!userProfile) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.json({ success: true, user: userProfile });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching profile",
            error: error.message,
        });
    }
});
exports.getUserProfile = getUserProfile;
// ✅ PUT /api/users/profile - อัปเดตข้อมูลโปรไฟล์
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { username, email } = req.body;
        if (!userId) {
            res.status(401).json({ success: false, message: "Not authorized" });
            return;
        }
        const updatedUser = yield prisma.users.update({
            where: { id: userId },
            data: { username, email },
            select: {
                id: true,
                username: true,
                email: true,
            },
        });
        res.json({
            success: true,
            message: "User updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: error.message,
        });
    }
});
exports.updateUserProfile = updateUserProfile;
// ✅ DELETE /api/users/:id - ลบผู้ใช้
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.id);
        if (isNaN(userId)) {
            res
                .status(400)
                .json({ success: false, message: "Invalid user ID user ja" });
            return;
        }
        const existingUser = yield prisma.users.findUnique({
            where: { id: userId },
        });
        if (!existingUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        yield prisma.users.delete({
            where: { id: userId },
        });
        res.json({ success: true, message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message,
        });
    }
});
exports.deleteUserById = deleteUserById;
// POST /api/login - เข้าสู่ระบบผู้ใช้
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identifier, password } = req.body; // ✅ เปลี่ยน email เป็น identifier (email หรือ username)
        if (!identifier || !password) {
            res.status(400).json({
                success: false,
                message: "กรุณากรอกชื่อผู้ใช้/อีเมลและรหัสผ่าน",
            });
            return;
        }
        // ✅ ค้นหาผู้ใช้จาก email หรือ username
        const user = yield prisma.users.findFirst({
            where: {
                OR: [{ email: identifier }, { username: identifier }],
            },
            select: { id: true, username: true, email: true, password_hash: true },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: "ชื่อผู้ใช้/อีเมล หรือรหัสผ่านไม่ถูกต้อง",
            });
            return;
        }
        // ✅ ตรวจสอบรหัสผ่าน
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password_hash);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "ชื่อผู้ใช้/อีเมล หรือรหัสผ่านไม่ถูกต้อง",
            });
            return;
        }
        // ✅ สร้าง Token
        const token = (0, auth_1.createToken)({ id: user.id, email: user.email });
        res.json({
            success: true,
            message: "เข้าสู่ระบบสำเร็จ",
            user: { id: user.id, username: user.username, email: user.email },
            token,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
            error: error.message,
        });
    }
});
exports.login = login;
// ✅ POST /api/users/upload-avatar - อัพโหลดรูปโปรไฟล์
const uploadAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Not authorized" });
            return;
        }
        if (!req.file) {
            res.status(400).json({ success: false, message: "No file uploaded" });
            return;
        }
        // ใช้ค่าดีฟอลต์เป็น "" ถ้าค่าของ req.file?.path เป็น null
        const imageUrl = (_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : "";
        // ✅ อัพเดทข้อมูล image_url ในฐานข้อมูล
        const updatedUser = yield prisma.users.update({
            where: { id: req.user.id },
            data: { image_url: imageUrl },
            select: {
                id: true,
                username: true,
                email: true,
                image_url: true,
                created_at: true,
            },
        });
        // ✅ ส่งค่ากลับไปยัง frontend
        res.json({
            success: true,
            message: "Profile picture updated successfully",
            imageUrl: updatedUser.image_url,
            user: updatedUser,
        });
    }
    catch (error) {
        console.error("Error uploading avatar:", error);
        res.status(500).json({
            success: false,
            message: "Error uploading avatar",
            error: error.message,
        });
    }
});
exports.uploadAvatar = uploadAvatar;
// ✅ PUT /api/users/:id/update-goals
const updateCalorieGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.id);
    const { calories_goal } = req.body;
    if (typeof calories_goal !== "number" || calories_goal <= 0) {
        return res.status(400).json({ message: "Invalid calories_goal" });
    }
    try {
        const updatedUser = yield prisma.users.update({
            where: { id: userId },
            data: { calories_goal },
        });
        return res.status(200).json({ success: true, user: updatedUser }); // ✅ return รูปแบบมาตรฐาน
    }
    catch (error) {
        console.error("Failed to update calories_goal:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateCalorieGoal = updateCalorieGoal;
