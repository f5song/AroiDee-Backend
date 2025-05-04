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
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
// import { googleLogin } from "../controllers/googleAuth.controller";
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
const router = express_1.default.Router();
// ตั้งค่า Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
// ตั้งค่า Multer + Cloudinary
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        return {
            folder: "aroi-dee-avatars",
            allowed_formats: ["jpg", "jpeg", "png", "gif"],
            transformation: [{ width: 500, height: 500, crop: "limit" }],
        };
    }),
});
const upload = (0, multer_1.default)({ storage });
router.get("/", user_controller_1.fetchUsers);
router.post("/register", user_controller_1.register);
router.get("/profile", authMiddleware_1.default, user_controller_1.getUserProfile);
router.put("/update", authMiddleware_1.default, user_controller_1.updateUserProfile);
router.delete("/delete/:id", authMiddleware_1.default, user_controller_1.deleteUserById);
router.post("/login", user_controller_1.login);
router.post("/upload-avatar", authMiddleware_1.default, upload.single("avatar"), user_controller_1.uploadAvatar);
router.put("/:id/update-goals", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, user_controller_1.updateCalorieGoal)(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating calorie goal", error });
    }
}));
// เพิ่มเส้นทางสำหรับ Google Login
// router.post("/google-login", googleLogin);
exports.default = router;
