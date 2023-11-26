import express from "express";
import authMiddleware from "../middlewares/isAuth";
import upload from "../utils/multer";
import userController from "../controllers/MediaUpload";
const router = express.Router();


router.post(
  "/upload",
  authMiddleware,
  upload.single("media"),
  userController.fileUpload
);

export default router;
