import express from "express";
import { 
  fetchUsers, 
  register, 
  getUserProfile, 
  updateUserProfile, 
  deleteUserById, 
  login,
  uploadAvatar
} from "../controllers/user.controller";
import authMiddleware from "../middlewares/authMiddleware";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// ตั้งค่า Cloudinary สำหรับการอัพโหลดรูปโปรไฟล์
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// ตั้งค่า Storage สำหรับ Multer
// ตั้งค่า Storage สำหรับ Multer โดยใช้ฟังก์ชันสำหรับ params
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req: Request, file: Express.Multer.File) => {
      return {
        folder: "aroi-dee-avatars",
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      };
    },
  });

const upload = multer({ storage });

// เส้นทางเดิม
router.get("/", fetchUsers);
router.post("/register", register);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/update", authMiddleware, updateUserProfile);
router.delete("/delete/:id", authMiddleware, deleteUserById);
router.post("/login", login);

// เพิ่มเส้นทางสำหรับอัพโหลดรูปโปรไฟล์
router.post("/upload-avatar", authMiddleware, upload.single("avatar"), uploadAvatar);

export default router;