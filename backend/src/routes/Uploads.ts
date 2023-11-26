import express from "express";
const router = express.Router();
import upload from "../utils/Multer";
import userController from "../controllers/fileUpload";
import authMiddleware from "../middleware/isAuth";


router.post("/upload",authMiddleware, upload.single("media"),userController.fileUpload);

export default router;
