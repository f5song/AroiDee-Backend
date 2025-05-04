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
exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ✅ ตั้งค่า Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// ✅ ตั้งค่า Storage สำหรับ Multer โดยไม่ต้องใช้ `Params`
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            folder: "aroi-dee-images", // 📂 ระบุโฟลเดอร์ใน Cloudinary
            format: file.mimetype.split("/")[1], // ✅ ใช้ mimetype กำหนดรูปแบบไฟล์ เช่น "jpg", "png"
            public_id: `${Date.now()}-${file.originalname}`, // ✅ ตั้งชื่อไฟล์เป็น timestamp + ชื่อไฟล์เดิม
        });
    }),
});
const upload = (0, multer_1.default)({ storage });
// ✅ API อัปโหลดรูปไปยัง Cloudinary
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: "No file uploaded" });
            return;
        }
        // ✅ คืนค่า URL ของไฟล์ที่อัปโหลด
        res.json({ success: true, url: req.file.path });
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ success: false, message: "Upload failed" });
    }
});
exports.uploadImage = uploadImage;
