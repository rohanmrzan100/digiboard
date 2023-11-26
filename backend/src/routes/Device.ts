import express from "express";
import authMiddleware from "../middleware/isAuth";
import {
  addDevice,
  deleteDevices,
  getDevice,
  syncDevice,
  generateUid,
  checkChange,
  resyncDevice,
  addPlaylistToDevice,
  removePlaylistFromDevice,
  playPlaylist,
  interactive,
  checkInteractive,
  playPlaylistInAllDevices,
} from "../controllers/Device";
import { createGroup } from "../controllers/Group";
const router = express.Router();

router.delete("/delete/:id", authMiddleware, deleteDevices);
router.delete("/remove_playlist/:did/:pid", removePlaylistFromDevice);

router.get("/sync/:uid", syncDevice);
router.get("/sync/update", authMiddleware, resyncDevice);
router.get("/get/:id", getDevice);
router.get("/generate/uid", generateUid);
router.get("/check_change/:id", checkChange);
router.get("/check_interactive/:did", checkInteractive);

router.post("/add", authMiddleware, addDevice);
router.post("/play_playlist/:did/:pid", playPlaylist);
router.post("/add_playlist/:did/:pid", addPlaylistToDevice);
router.post("/interactive/:did/:mid", interactive);
router.post(
  "/play_playlist/:pid",
  authMiddleware,
  playPlaylistInAllDevices
);

router.get("/sync_update/:id", resyncDevice);

//group
router.post("/group/add", authMiddleware, createGroup);


export default router;
