import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// ✅ ตั้งค่า Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ ตั้งค่า Storage สำหรับ Multer โดยไม่ต้องใช้ `Params`
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: Express.Multer.File) => ({
    folder: "aroi-dee-images", // 📂 ระบุโฟลเดอร์ใน Cloudinary
    format: file.mimetype.split("/")[1], // ✅ ใช้ mimetype กำหนดรูปแบบไฟล์ เช่น "jpg", "png"
    public_id: `${Date.now()}-${file.originalname}`, // ✅ ตั้งชื่อไฟล์เป็น timestamp + ชื่อไฟล์เดิม
  }),
});

const upload = multer({ storage });

// ✅ API อัปโหลดรูปไปยัง Cloudinary
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }

    // ✅ คืนค่า URL ของไฟล์ที่อัปโหลด
    res.json({ success: true, url: req.file.path });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};
