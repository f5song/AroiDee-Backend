import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// ✅ ตั้งค่า Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ ตั้งค่า `multer-storage-cloudinary`
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: Express.Multer.File) => ({
    folder: "aroi-dee-images",
    format: file.mimetype.split("/")[1], // ✅ ดึง format จาก mimetype เช่น jpg, png
    public_id: `${Date.now()}-${file.originalname}`, // ✅ ใช้ timestamp + ชื่อไฟล์
  }),
});

const upload = multer({ storage });

// ✅ API อัปโหลดรูป
app.post("/api/upload", upload.single("image"), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }

    res.json({ success: true, url: (req.file as Express.Multer.File).path });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

export default app;
