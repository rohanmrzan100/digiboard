import express from "express";
import authMiddleware from "../middleware/isAuth";
import {
  register,
  login,
  getUserData,
  getAllUser,
  viewAllDevices,
  deleteMedia,
} from "../controllers/User";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);


router.get("/all", getAllUser);
router.get("/content", authMiddleware, getUserData);
router.get("/view_devices", authMiddleware, viewAllDevices);
router.delete("/delete_media/:id", authMiddleware, deleteMedia);



export default router;
