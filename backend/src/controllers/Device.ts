import "dotenv/config";
import env from "../env";
import { RequestHandler } from "express";
import deviceModel, { Device } from "../models/Device";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import userModel, { User } from "../models/User";
import uidModel from "../models/UniqueID";
import playlistModel from "../models/Playlist";
import mediaModel from "../models/Media";

interface addDevice {
  name: string;
  uid: string;
  owner_id: string;
}

export const addDevice: RequestHandler<unknown, unknown, addDevice> = async (
  req,
  res,
  next
) => {
  try {
    let device: Device = {
      _id: "",
      name: "",
      uid: "",
      owner_id: "",
      c_playlist: "",
      a_playlist: [""],
      change: false,
      SFD_playlist: [""],
      SFR_playlist: [""],
      playlistChange: [
        {
          name: "",
          added: { media: "", name: "" },
          remove: { media: "", name: "" },
        },
      ],
    };
    const owner = await userModel.findById(res.locals.user._id);
    if (!owner)
      return res
        .status(400)
        .json({ msg: "User is not found", status: "0", device });
    const { name, uid } = req.body;

    if (!name || !uid) {
      return res
        .status(400)
        .json({ msg: "Please input all data", status: "0", device });
    }

    const checkuid = await uidModel.findOne({ uid: uid });
    if (!checkuid) {
      return res.status(400).json({ msg: "Invalid Code", status: "0", device });
    }
    const addedDevice = new deviceModel({
      name: name,
      uid: uid.toLocaleLowerCase(),
      owner_id: owner?._id,
      c_playlist: "",
      sfd_playlist: "",
    });
    const doc = await addedDevice.save();
    owner.device_id.push(addedDevice._id);
    await owner?.save();

    res
      .status(200)
      .json({ device: doc, status: "1", msg: "Device added sucessfully." });
  } catch (error) {
    next(error);
  }
};

// @route      /api/device/delete/:id
// @desc       delete added devicess
// @auth       protected

export const deleteDevices: RequestHandler = async (req, res, next) => {
  try {
    const owner_id = res.locals.user._id;
    const device_id = req.params.id;
    if (!mongoose.isValidObjectId(device_id)) {
      return res.status(400).json({ msg: "Invalid device ID", status: "0" });
    }
    const device = await deviceModel.findById(device_id);
    if (!device) {
      return res.status(400).json({ msg: "Device not found", status: "0" });
    }

    const owner = await userModel.findByIdAndUpdate(
      { _id: device.owner_id },
      { $pull: { device_id: device_id } }
    );
    for (const playlist_id of device.a_playlist) {
      const playlist = await playlistModel.findByIdAndUpdate(
        { _id: playlist_id },
        { $pull: { device: device_id } }
      );
    }

    await deviceModel.findByIdAndDelete(device_id);
    res.status(200).json({ msg: "Device is removed", status: "1" });
  } catch (error) {
    next(error);
  }
};

// @route     /api/device/:id
// @desc      get devices
// @auth      protected
export const getDevice: RequestHandler = async (req, res, next) => {
  let EmptyDevice = {
    _id: "",
    name: "",
    c_playlist: "",
    action: "",
    a_playlist: [""],
  };
  try {
    const device_id = req.params.id;
    if (!mongoose.isValidObjectId(device_id)) {
      return res
        .status(400)
        .json({ msg: "Invalid device ID", device: EmptyDevice, status: "0" });
    }
    const device = await deviceModel
      .findById(device_id)
      .select("playlist name _id c_playlist a_playlist sfd_playlist")
      .populate("a_playlist");
    if (!device) {
      return res
        .status(400)
        .json({ msg: "Invalid device ID", device: EmptyDevice, status: "0" });
    }

    res.status(200).json({ msg: "Device Found", device, status: "1" });
  } catch (error) {
    next();
  }
};

// @route      /api/device/generateuid
// @desc        generate unique token and store in DB for SYNC
// @auth       public
// player
export const generateUid: RequestHandler = async (req, res, next) => {
  try {
    function uniqueid() {
      // always start with a letter (for DOM friendlyness)
      let idstr = String.fromCharCode(Math.floor(Math.random() * 25 + 65));
      do {
        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
        var ascicode = Math.floor(Math.random() * 42 + 48);
        if (ascicode < 58 || ascicode > 64) {
          // exclude all chars between : (58) and @ (64)
          idstr += String.fromCharCode(ascicode);
        }
      } while (idstr.length < 6);

      return idstr;
    }

    const code = uniqueid().toLocaleLowerCase();
    console.log(code);

    const uid = new uidModel({
      uid: code,
    });
    await uid.save();
    res.status(200).json({ msg: "uid generated and stored in DB", uid: uid });
  } catch (error) {
    next();
  }
};

//player
export const syncDevice: RequestHandler = async (req, res, next) => {
  try {
    const uid = req.params.uid;

    let device = await deviceModel.findOne({ uid: uid });
    if (!device) {
      const device: Device = {
        _id: "",
        name: "",
        uid: "",
        owner_id: "",
        change: false,
        c_playlist: "",
        a_playlist: [""],
        SFD_playlist: [""],
        SFR_playlist: [""],
        playlistChange: [
          {
            name: "",
            added: { media: "", name: "" },
            remove: { media: "", name: "" },
          },
        ],
      };
      return res
        .status(400)
        .json({ status: "0", device, msg: "Device not found", token: " " });
    }
    const token = jwt.sign({ _id: device.owner_id }, env.SECRET, {
      expiresIn: "30d",
    });
    res.status(200).json({
      status: "1",
      device,
      token: token,
      msg: "Device verified.",
    });
  } catch (error) {
    next(error);
  }
};

// @route      /api/device/update_sync/:id
// @desc       resync device from website
// @auth       private

export const resyncDevice: RequestHandler = async (req, res, next) => {
  try {
    const device_id = req.params.id;
    if (!mongoose.isValidObjectId(device_id)) {
      return res.status(400).json({ msg: "Invalid device ID", status: "0" });
    }

    const device = await deviceModel.findById(device_id);
    if (!device) {
      return res.status(400).json({ msg: "Device not found", status: "0" });
    }

    device.change = true;
    await device.save();

    res.status(200).json({ msg: "Device is resynced", status: "1" });
  } catch (error) {
    next(error);
  }
};

// @route      /api/device/check_change/:id
// @desc       check for change in device media
// @auth       public
// player

export const checkChange: RequestHandler = async (req, res, next) => {
  try {
    let SFD_playlist: any = [];
    let SFR_playlist: any = [];
    let playlistChange: any = [
      {
        name: "",
        added: [],
        remove: [],
      },
    ];
    const device_id = req.params.id;
    const device = await deviceModel
      .findById(device_id)
      .select("SFD_playlist SFR_playlist playlistChange name");

    if (!device) {
      return res.status(400).json({ msg: "Device not found", status: "0" });
    }

    if (
      device.SFD_playlist.length ||
      device.SFR_playlist.length ||
      device.playlistChange.length
    ) {
      SFD_playlist = device.SFD_playlist;
      SFR_playlist = device.SFR_playlist;
      playlistChange = device.playlistChange;
      await deviceModel.updateOne(
        { _id: device_id },
        { $unset: { SFD_playlist: 1 } }
      );
      await deviceModel.updateOne(
        { _id: device_id },
        { $unset: { SFR_playlist: 1 } }
      );
      await deviceModel.updateOne(
        { _id: device_id },
        { $unset: { playlistChange: 1 } }
      );
      let temp = SFD_playlist;
      SFD_playlist = SFD_playlist.filter(
        (val: string) => !SFR_playlist.includes(val)
      );
      SFR_playlist = SFR_playlist.filter((val: string) => !temp.includes(val));

      return res.status(200).json({
        msg: "Device Changed",
        SFD_playlist,
        SFR_playlist,
        playlistChange,
        status: "1",
      });
    }

    res.status(200).json({
      msg: "Device  Not Changed",
      SFD_playlist,
      SFR_playlist,
      playlistChange: [
        {
          name: "",
          added: { media: "", name: "" },
          remove: { media: "", name: "" },
        },
      ],
      status: "1",
    });
  } catch (error) {
    next();
  }
};

// @route      /api/device/add_playlist/:did/:pid
// @desc       resync device from website
// @auth       private

export const addPlaylistToDevice: RequestHandler = async (req, res, next) => {
  try {
    const device_id = req.params.did;
    const playlist_id = req.params.pid;

    if (
      !mongoose.isValidObjectId(device_id) ||
      !mongoose.isValidObjectId(playlist_id)
    ) {
      return res.status(400).json({ msg: "Invalid  ID", status: "0" });
    }

    const device = await deviceModel.findById(device_id);
    if (!device) {
      return res.status(400).json({ msg: "Device not found", status: "0" });
    }
    const playlist = await playlistModel.findById(playlist_id);
    if (!playlist) {
      return res.status(400).json({ msg: "Playlist not found", status: "0" });
    }
    if (playlist.media.length <= 0) {
      return res
        .status(400)
        .json({ msg: "Playlist is empty.Choose another.", status: "0" });
    }
    playlist.device.push(device_id);

    device.SFD_playlist.push(playlist_id);

    device.a_playlist.push(playlist_id);
    await playlist.save();
    await device.save();

    res.status(200).json({ msg: "Playlist added to device", status: "1" });
  } catch (error) {
    next(error);
  }
};

// @route      /api/device/remove_playlist/:did/:pid
// @desc       resync device from website
// @auth       private

export const removePlaylistFromDevice: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const device_id = req.params.did;
    const playlist_id = req.params.pid;

    if (
      !mongoose.isValidObjectId(device_id) ||
      !mongoose.isValidObjectId(playlist_id)
    ) {
      return res.status(400).json({ msg: "Invalid  ID", status: "0" });
    }

    const device = await deviceModel.findById(device_id);
    if (!device) {
      return res.status(400).json({ msg: "Device not found", status: "0" });
    }
    const playlist = await playlistModel.findById(playlist_id);
    if (!playlist) {
      return res.status(400).json({ msg: "Playlist not found", status: "0" });
    }
    if (device.c_playlist == playlist.name) {
      device.c_playlist = "";
    }
    await playlistModel.findByIdAndUpdate(
      { _id: playlist_id },
      { $pull: { device: device_id } }
    );

    await deviceModel.findByIdAndUpdate(
      { _id: device_id },
      { $pull: { a_playlist: playlist_id } }
    );

    device.SFR_playlist.push(playlist_id);

    await playlist.save();
    await device.save();

    res.status(200).json({ msg: "Playlist removed from device", status: "1" });
  } catch (error) {
    next(error);
  }
};

// @route      /api/device/play_playlist/:did/:pid
// @desc       resync device from website
// @auth       private

export const playPlaylist: RequestHandler = async (req, res, next) => {
  let playlist = {
    name: "",
    media: [""],
    device: [""],
  };
  try {
    const device_id = req.params.did;
    const playlist_id = req.params.pid;

    if (
      !mongoose.isValidObjectId(device_id) ||
      !mongoose.isValidObjectId(playlist_id)
    ) {
      return res.status(400).json({ msg: "Invalid  ID", status: "0" });
    }

    const device = await deviceModel.findById(device_id);
    if (!device) {
      return res
        .status(400)
        .json({ msg: "Device not found", playlist, status: "0" });
    }
    const foundPlaylist = await playlistModel.findById(playlist_id);
    if (!foundPlaylist) {
      return res
        .status(400)
        .json({ msg: "Playlist not found", playlist, status: "0" });
    }

    device.c_playlist = foundPlaylist.name;
    await device.save();
    return res
      .status(200)
      .json({ msg: "Playlist added for playing", foundPlaylist, status: 1 });
  } catch (error) {
    next(error);
  }
};

// @route      /api/device/play_playlist/:pid
// @desc       resync device from website
// @auth       private

export const playPlaylistInAllDevices: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const user_id = res.locals.user._id;
    const playlist_id = req.params.pid;

    if (
      !mongoose.isValidObjectId(user_id) ||
      !mongoose.isValidObjectId(playlist_id)
    ) {
      return res.status(400).json({ msg: "Invalid  ID", status: "0" });
    }
    const user = await userModel.findById(user_id);
    if (!user) {
      return res.status(400).json({ msg: "User not found", status: "0" });
    }
    const playlist = await playlistModel.findById(playlist_id);
    if (!playlist) {
      return res.status(400).json({ msg: "Playlist not found", status: "0" });
    }
    if (playlist.media.length <= 0) {
      return res
        .status(400)
        .json({ msg: "Playlist is empty.Choose another.", status: "0" });
    }
    for (const device_id of user.device_id) {
      const device = await deviceModel.findById(device_id);
      if (!device) {
        return res.status(400).json({ msg: "Device not found", status: "0" });
      }

      playlist.device.push(device_id);

      device.SFD_playlist.push(playlist_id);

      device.a_playlist.push(playlist_id);

      device.c_playlist = playlist.name;
      await device.save();
      await playlist.save();
    }

    return res
      .status(200)
      .json({ msg: "Playlist added for playing", status: 1 });
  } catch (error) {
    next(error);
  }
};

// @route      /api/device/interactive/:did/:mid
// @desc       add media for interactive play
// @auth       private
export const interactive: RequestHandler = async (req, res, next) => {
  let interactive: string = "";
  try {
    const device_id = req.params.did;
    const media_id = req.params.mid;

    if (
      !mongoose.isValidObjectId(device_id) ||
      !mongoose.isValidObjectId(media_id)
    ) {
      return res.status(400).json({ msg: "Invalid  ID", status: "0" });
    }
    const device = await deviceModel.findById(device_id);
    if (!device) {
      return res
        .status(400)
        .json({ msg: "Device not found", interactive, status: "0" });
    }
    const media = await mediaModel.findById(media_id);
    if (!media) {
      return res
        .status(400)
        .json({ msg: "Media not found", interactive, status: "0" });
    }

    device.interactive = media.media;
    await device.save();
    res.status(200).json({
      msg: "Interactive media added to device",
      status: "1",
      interactive: device.interactive,
    });
  } catch (error) {
    next(error);
  }
};

// @route      /api/device/check_interactive/:did/
// @desc       add media for interactive play
// @auth       private
export const checkInteractive: RequestHandler = async (req, res, next) => {
  let interactive: string = "";
  try {
    const device_id = req.params.did;

    if (!mongoose.isValidObjectId(device_id)) {
      return res.status(400).json({ msg: "Invalid  ID", status: "0" });
    }
    const device = await deviceModel.findById(device_id);
    if (!device) {
      return res.status(400).json({
        msg: "Device not found",
        interactive: interactive,
        status: "0",
      });
    }

    if (device.interactive) {
      const media: string = device.interactive;
      device.interactive = "";
      await device.save();
      res.status(200).json({
        msg: "Interactive media added to device",
        status: "1",
        interactive: media,
      });
    } else {
      res.status(200).json({
        msg: "No interactive added",
        status: "0",
        interactive: interactive,
      });
    }
  } catch (error) {
    next(error);
  }
};



