"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
    throw new Error("❌ JWT_SECRET is not set in environment variables!");
}
const authMiddleware = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ success: false, message: "Access Denied. No token provided." });
            return;
        }
        // ถอดรหัส JWT token
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        // เพิ่มข้อมูลผู้ใช้ลงใน request object
        req.user = { id: decoded.id, email: decoded.email };
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: "Invalid token." });
    }
};
exports.default = authMiddleware;
