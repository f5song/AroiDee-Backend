import express from "express";
import { fetchUsers, register, getUserProfile, updateUserProfile, deleteUserById  } from "../controllers/user.controller";
import { authMiddleware  } from "../middlewares/authMiddleware";
import { adminOnly } from "../middlewares/adminOnly";

const router = express.Router();

router.get("/", fetchUsers);
router.post("/register", register);
router.get("/profile", authMiddleware , getUserProfile);
router.put("/update", authMiddleware , updateUserProfile);
router.delete("/delete/:id", authMiddleware , adminOnly, deleteUserById);

export default router;
