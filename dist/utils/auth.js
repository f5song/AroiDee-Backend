"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ใช้ JWT_SECRET จาก Environment Variables
const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
    throw new Error("❌ JWT_SECRET is not set in environment variables!");
}
// ฟังก์ชันสร้าง JWT Token
const createToken = (user) => {
    return jsonwebtoken_1.default.sign(user, // Payload มี userId และ email
    SECRET_KEY, { expiresIn: "7d" } // Token หมดอายุใน 7 วัน
    );
};
exports.createToken = createToken;
// ฟังก์ชันตรวจสอบและถอดรหัส JWT Token
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, SECRET_KEY);
};
exports.verifyToken = verifyToken;
