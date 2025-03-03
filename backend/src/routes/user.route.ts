import express from "express";
import { fetchUsers, register, getUserProfile, updateUserProfile, deleteUserById  } from "../controllers/user.controller";
import { protect } from "../middlewares/authMiddleware";
import { adminOnly } from "../middlewares/adminOnly";

const router = express.Router();

router.get("/", fetchUsers);
router.post("/register", register);
router.get("/profile", protect, getUserProfile);
router.put("/update", protect, updateUserProfile);
router.delete("/delete/:id", protect, adminOnly, deleteUserById);

export default router;
