import express from "express";
import multer from "multer";

import {
  uploadImage,
  getAllImagePreSignedUrls,
  deleteImage,
} from "../controllers/imageController";

import { multerConfig } from "../config/multerConfig";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post("/upload", upload.single("file"), uploadImage);
router.get("/getAll", getAllImagePreSignedUrls);
router.post("/delete/:fileName", deleteImage);

export { router };
