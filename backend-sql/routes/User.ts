import express from "express";
// import authMiddleware from "../middleware/isAuth";
import { getAllUser, getUserData, login, register } from "../controllers/User";
import authMiddleware from "../middlewares/isAuth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/all", getAllUser);

router.get("/content", authMiddleware, getUserData);

export default router;
