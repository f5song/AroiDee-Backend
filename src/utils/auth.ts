import jwt from "jsonwebtoken";

// ใช้ JWT_SECRET จาก Environment Variables
const SECRET_KEY = process.env.JWT_SECRET as string;

if (!SECRET_KEY) {
  throw new Error("❌ JWT_SECRET is not set in environment variables!");
}

interface UserPayload {
  id: number;
  email: string;
}

// ฟังก์ชันสร้าง JWT Token
export const createToken = (user: UserPayload) => {
  return jwt.sign(
    user, // Payload มี userId และ email
    SECRET_KEY,
    { expiresIn: "7d" } // Token หมดอายุใน 7 วัน
  );
};

// ฟังก์ชันตรวจสอบและถอดรหัส JWT Token
export const verifyToken = (token: string): UserPayload => {
  return jwt.verify(token, SECRET_KEY) as UserPayload;
};