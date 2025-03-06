import jwt from "jsonwebtoken";

// ใช้ JWT_SECRET จาก Environment Variables
const SECRET_KEY = process.env.JWT_SECRET as string;

if (!SECRET_KEY) {
  throw new Error("❌ JWT_SECRET is not set in environment variables!");
}

// ✅ ฟังก์ชันสร้าง JWT Token
export const createToken = (user: { id: number; email: string }) => {
  return jwt.sign(
    { userId: user.id, email: user.email }, // ✅ ใส่ข้อมูลผู้ใช้ใน Payload
    SECRET_KEY, // 🔑 ใช้ JWT_SECRET จาก Environment Variables
    { expiresIn: "7d" } // ⏳ อายุของ Token = 7 วัน
  );
};

// ✅ ฟังก์ชันตรวจสอบและถอดรหัส JWT Token
export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET_KEY);
};
