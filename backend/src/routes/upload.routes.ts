import express from "express";
import { uploadImage } from "../controllers/upload.controller";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/upload", upload.single("image"), uploadImage);

export default router;
