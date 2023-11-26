import express from "express";
import {
  addDevice,
  generateUid,
  getDeviceById,
  syncDevice,
} from "../controllers/Devices";
import authMiddleware from "../middlewares/isAuth";
const router = express.Router();

router.get("/generate/uid", generateUid);
router.post("/add", authMiddleware, addDevice);
router.get("/get/:id", getDeviceById);

router.get("/sync/:uid", syncDevice);

export default router;
