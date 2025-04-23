// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import { OAuth2Client } from "google-auth-library";
// import { createToken } from "../utils/auth";

// const prisma = new PrismaClient();
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// interface GoogleUserInfo {
//   email: string;
//   name: string;
//   picture: string;
//   sub: string; // Google's user ID
// }

// // POST /api/users/google-login - เข้าสู่ระบบด้วย Google
// export const googleLogin = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { token } = req.body;
//     console.log("🔹 Google Token ที่ได้รับจาก Frontend:", token);

//     if (!token) {
//       res.status(400).json({ success: false, message: "ไม่พบ Token" });
//       return;
//     }

//     // ตรวจสอบความถูกต้องของ token กับ Google
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID
//     });

//     // ดึงข้อมูลผู้ใช้จาก token
//     const payload = ticket.getPayload() as GoogleUserInfo;
//     const { email, name, picture, sub: googleId } = payload;

//     if (!email) {
//       res.status(400).json({ success: false, message: "ไม่พบข้อมูลอีเมลในบัญชี Google" });
//       return;
//     }

//     // ค้นหาผู้ใช้จากอีเมล
//     let user = await prisma.users.findUnique({ 
//       where: { email }
//     });

//     // หากไม่มีผู้ใช้ในระบบ ให้สร้างใหม่
//     if (!user) {
//       // สร้างชื่อผู้ใช้จากอีเมล (เอาเฉพาะส่วนก่อน @)
//       let username = email.split('@')[0].toLowerCase();
      
//       // ตรวจสอบว่าชื่อผู้ใช้ซ้ำหรือไม่
//       const usernameExists = await prisma.users.findFirst({ 
//         where: { username } 
//       });
      
//       if (usernameExists) {
//         // ถ้าซ้ำให้เพิ่มตัวเลขสุ่มต่อท้าย
//         username = `${username}${Math.floor(Math.random() * 10000)}`;
//       }

//       // ตรวจสอบว่าชื่อผู้ใช้ตรงตามรูปแบบ
//       const usernameRegex = /^[a-z0-9_-]+$/;
//       if (!usernameRegex.test(username)) {
//         username = username.replace(/[^a-z0-9_-]/g, '');
        
//         // ถ้าหลังจากแปลงแล้วไม่มีตัวอักษรเหลือ ให้ใช้ค่าเริ่มต้น
//         if (!username) {
//           username = `user${Math.floor(Math.random() * 10000)}`;
//         }
//       }
      
//       // สร้างผู้ใช้ใหม่
//       user = await prisma.users.create({
//         data: {
//           username,
//           email,
//           password_hash: null, // ไม่ใช้รหัสผ่านสำหรับผู้ใช้ Google
//           image_url: picture,
//           google_id: googleId,
//           provider: 'google'
//         }
//       });
//     } else {
//       // ถ้าผู้ใช้มีอยู่แล้ว ให้อัปเดตข้อมูล Google (ถ้ายังไม่มี)
//       if (!user.google_id) {
//         await prisma.users.update({
//           where: { id: user.id },
//           data: {
//             google_id: googleId,
//             image_url: user.image_url || picture,
//             provider: user.provider || 'google'
//           }
//         });
//       }
//     }

//     // สร้าง JWT token
//     const jwtToken = createToken({ userId: user.id, email: user.email });

//     // ส่งข้อมูลกลับไปยัง frontend
//     res.json({
//       success: true,
//       message: "เข้าสู่ระบบด้วย Google สำเร็จ",
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         image_url: user.image_url
//       },
//       token: jwtToken
//     });
//   } catch (error: any) {
//     console.error("Google login error:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google", 
//       error: error.message 
//     });
//   }
// };