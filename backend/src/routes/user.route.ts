import express from "express";
import { fetchUsers, register, getUserProfile, updateUserProfile, deleteUserById, login } from "../controllers/user.controller";
import authMiddleware from "../middlewares/authMiddleware"; // ✅ ใช้ Default Import ถ้า Export แบบ `export default`

const router = express.Router();

router.get("/", fetchUsers);
router.post("/register", register);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/update", authMiddleware, updateUserProfile);
router.delete("/delete/:id", authMiddleware, deleteUserById); // ✅ ลบ `adminOnly`
router.post("/login", login);

export default router;
