import express from "express";
import authMiddleware from "../middleware/isAuth";
import { AddMedia, GetInteractive, PlayInteractive, RemoveMedia } from "../controllers/Interactive";

const router = express.Router();

router.post("/add", authMiddleware, AddMedia);
router.post("/play/:id", authMiddleware, PlayInteractive);
router.get("/get", authMiddleware, GetInteractive);
router.delete("/remove/:id", authMiddleware, RemoveMedia);


export default router;
