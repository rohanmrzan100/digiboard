import { Router } from "express";
import {
  addMedia,
  createPlaylist,
  deleteMedia,
  deletePlaylistByID,
  getPlaylistById,
  mediaNotAssignedToPlaylist,
  playlistNotAssigned,
} from "../controllers/Playlist";
import authMiddleware from "../middleware/isAuth";
const router = Router();

router.post("/create", authMiddleware, createPlaylist);
router.get("/get/:id", authMiddleware, getPlaylistById);
router.delete("/delete/:id", authMiddleware, deletePlaylistByID);
router.delete("/media_delete/:pid/:mid", authMiddleware, deleteMedia);
router.post("/add_media/:pid", authMiddleware, addMedia);
router.get("/not_assigned/:did", authMiddleware, playlistNotAssigned);
router.get(
  "/notassigned/media/:pid",
  authMiddleware,
  mediaNotAssignedToPlaylist
);

export default router;
