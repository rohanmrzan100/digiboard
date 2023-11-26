// @route      /api/playlist/create/
// @desc       check for change in device media
// @auth       public

import { RequestHandler } from "express";
import mongoose from "mongoose";
import userModel from "../models/User";
import playlistModel, { Playlist } from "../models/Playlist";
import mediaModel, { Media } from "../models/Media";
import deviceModel, { Device } from "../models/Device";

////////API OK///////////////////////////
export const createPlaylist: RequestHandler = async (req, res, next) => {
  try {
    const array: [string] = req.body.array;
    const name = req.body.name;
    if (!array || !name) {
      return res
        .status(400)
        .json({ msg: "Please Provide all data ", status: "0" });
    }
    const userID = res.locals.user._id;
    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({ msg: "Invalid user ID", status: "0" });
    }
    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(400).json({ msg: "Cannot find user", status: "0" });
    }
    for (const item of user.playlist) {
      const playlist = await playlistModel.findById(item);
      if (!playlist) {
        return res.status(400).json({ msg: "Playlist not found", status: "0" });
      }
      if (playlist.name.trim() === name.trim()) {
        return res
          .status(400)
          .json({ msg: "Playlist name alredy Taken", status: "0" });
      }
    }

    const playlist = new playlistModel({
      name: name,
      media: array,
    });

    for (const media_id of playlist.media) {
      const media = await mediaModel.findById(media_id);
      if (media) {
        media.playlist.push(playlist._id);
        await media.save();
      }
    }

    user.playlist.push(playlist._id);
    await playlist.save();
    await user.save();

    res.status(200).json({ msg: "Playlist is created.", status: "1" });
  } catch (error) {
    next();
  }
};

// @route      /api/playlist/get/:id
// @desc       check for change in device media
// @auth       public

export const getPlaylistById: RequestHandler = async (req, res, next) => {
  try {
    let playlist: Playlist = {
      _id: "",
      name: "",
      media: [""],
      device: [""],
    };
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ msg: "Invalid playlist id", status: "0", playlist });
    }
    playlist = <Playlist>await playlistModel.findById(id).populate("media");
    if (!playlist) {
      return res
        .status(400)
        .json({ msg: "Playlist not found", playlist, status: "0" });
    }
    res.status(200).json({ msg: "Playlist Found.", status: "1", playlist });
  } catch (error) {
    next();
  }
};

// @route      /api/playlist/delete/:id
// @desc       check for change in device media
// @auth       public
export const deletePlaylistByID: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user_id = res.locals.user._id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ msg: "Invalid playlist id", status: "0" });
    }
    const playlist = await playlistModel.findById(id);
    if (!playlist) {
      return res.status(400).json({ msg: "Playlist not found", status: "0" });
    }
    for (const device_id of playlist.device) {
      const device = await deviceModel.findById(device_id);
      if (!device) {
        return res.status(400).json({ msg: "Device not found", status: "0" });
      }
      if (device.c_playlist === playlist.name) {
        return res.status(400).json({
          msg: "Cannot delete playlist as it is playing currently in one of the devices.",
          status: "0",
        });
      }

      device.SFR_playlist.push(id);
      await device.save();
      await deviceModel.updateOne(
        { _id: device_id },
        { $pull: { playlist: id } }
      );
    }

    for (const media_id of playlist.media) {
      await mediaModel.updateOne(
        { _id: media_id },
        { $pull: { playlist: id } }
      );
    }

    await userModel.updateOne({ _id: user_id }, { $pull: { playlist: id } });
    await playlistModel.findByIdAndDelete(id);

    res.status(200).json({ msg: "Playlist Deleted.", status: "1" });
  } catch (error) {
    next();
  }
};

// @route      /api/playlist/media_delete/:pid/:mid
// @desc       check for change in device media
// @auth       public

export const deleteMedia: RequestHandler = async (req, res, next) => {
  try {
    const media_id = req.params.mid;
    const playlist_id = req.params.pid;
    if (
      !mongoose.isValidObjectId(media_id) ||
      !mongoose.isValidObjectId(playlist_id)
    ) {
      return res.status(400).json({ msg: "Invalid  id", status: "0" });
    }

    const playlist = await playlistModel.findById(playlist_id);
    if (!playlist) {
      return res.status(400).json({ msg: "Playlist not found", status: "0" });
    }
    const media = await mediaModel.findById(media_id);
    if (!media) {
      return res.status(400).json({ msg: "Media not found", status: "0" });
    }
    for (const device_id of playlist.device) {
      const device = await deviceModel.findById(device_id);
      if (!device) {
        return res.status(400).json({ msg: "Device not found", status: "0" });
      }
      device.playlistChange.push({
        name: playlist.name,
        remove: {
          name: media.name,
          media: media.media,
        },
        added: {
          name: "",
          media: "",
        },
      });
      await device.save();
    }
    await playlistModel.updateOne(
      { _id: playlist_id },
      { $pull: { media: media_id } }
    );

    await mediaModel.updateOne(
      { _id: media_id },
      { $pull: { playlist: playlist_id } }
    );

    res
      .status(200)
      .json({ msg: "Media deleted from playlist Successfully", status: "1" });
  } catch (error) {
    next(error);
  }
};
// @route      /api/playlist/add_media/:pid
// @desc       check for change in device media
// @auth       public

export const addMedia: RequestHandler = async (req, res, next) => {
  try {
    const array = req.body.array;
    const playlist_id = req.params.pid;
    if (!mongoose.isValidObjectId(playlist_id)) {
      return res.status(400).json({ msg: "Invalid  id", status: "0" });
    }

    const playlist = await playlistModel.findById(playlist_id);
    if (!playlist) {
      return res.status(400).json({ msg: "Playlist not found", status: "0" });
    }

    for (const media_id of array) {
      const media = await mediaModel.findById(media_id);
      if (!media) {
        return res.status(400).json({ msg: "Media not found", status: "0" });
      }

      playlist.media.push(media_id);
      media.playlist.push(playlist_id);
      await media.save();
      await playlist.save();
      // console.log(playlist);

      if (playlist.device.length > 0) {
        for (const device_id of playlist.device) {
          const device = await deviceModel.findById(device_id);
          if (!device) {
            return res
              .status(400)
              .json({ msg: "Device not found", status: "0" });
          }
          device.playlistChange.push({
            name: playlist.name,
            added: {
              name: media.name,
              media: media.media,
            },
            remove: {
              name: "",
              media: "",
            },
          });
          await device.save();
        }
      }

      res.status(200).json({
        msg: "Media added to playlist Successfully",
        playlist,
        status: "1",
      });
    }
  } catch (error) {
    next(error);
  }
};

// @route      /api/playlist/notassigned/:did
// @desc      get playlist that are not assigned to device
// @auth       public

export const playlistNotAssigned: RequestHandler = async (req, res, next) => {
  try {
    let array: Playlist[] = [];
    const device_id = req.params.did;
    const user_id = res.locals.user._id;
    if (
      !mongoose.isValidObjectId(device_id) ||
      !mongoose.isValidObjectId(user_id)
    ) {
      return res.status(400).json({ msg: "Invalid  id", status: "0" });
    }

    const device = await deviceModel.findById(device_id);
    if (!device) {
      return res.status(400).json({ msg: "Device not found", status: "0" });
    }

    const user = await userModel.findById(user_id);
    if (!user) {
      return res.status(400).json({ msg: "User not found", status: "0" });
    }
    const allPlaylist = user.playlist;
    const assigned = device.a_playlist;

    const notassigned = allPlaylist.filter(
      (val: string) => !assigned.includes(val)
    );

    for (const playlist_id of notassigned) {
      const playlist = await playlistModel.findById(playlist_id);
      if (!playlist) {
        return res.status(400).json({ msg: "Playlist not found", status: "0" });
      }
      array = [...array, playlist];
    }
    res.status(200).json({ msg: "Ok", notassigned: array, status: "1" });
  } catch (error) {
    next(error);
  }
};

// @route      /api/playlist/notassigned/media/:pid
// @desc      get playlist that are not assigned to device
// @auth       public

export const mediaNotAssignedToPlaylist: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    let notassigned: Media[] = [];
    const playlist_id = req.params.pid;
    const user_id = res.locals.user._id;
    if (
      !mongoose.isValidObjectId(playlist_id) ||
      !mongoose.isValidObjectId(user_id)
    ) {
      return res.status(400).json({ msg: "Invalid  id", status: "0" });
    }

    const playlist = await playlistModel.findById(playlist_id);
    if (!playlist) {
      return res.status(400).json({ msg: "Playlist not found", status: "0" });
    }
    const p_media = playlist.media;

    const user = await userModel.findById(user_id);
    if (!user) {
      return res.status(400).json({ msg: "User not found", status: "0" });
    }
    const allmedia = user.media_id;
    console.log(allmedia);

    const array = allmedia.filter((val) => !p_media.includes(val));
    // console.log(array);

    for (const media_id of array) {
      const media = await mediaModel.findById(media_id);
      if (!media) {
        return res.status(400).json({ msg: "Media not found", status: "0" });
      }
      notassigned = [...notassigned, media];
    }
    res.json({ msg: "OK", array: notassigned, status: "1" });
  } catch (error) {
    next(error);
  }
};
