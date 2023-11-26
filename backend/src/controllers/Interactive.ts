import { RequestHandler } from "express";
import mongoose from "mongoose";
import userModel from "../models/User";
import InteractiveModel from "../models/Interactive";
import deviceModel from "../models/Device";
import mediaModel from "../models/Media";

export const GetInteractive: RequestHandler = async (req, res, next) => {
  try {
    let inter = {
      user_id: res.locals.user._id,
      media: [],
    };
    const userID = res.locals.user._id;
    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(400).json({ msg: "Cannot find user", status: "0" });
    }
    const interactive = await InteractiveModel.findById(
      user.interactive
    ).populate("media");

    if (!interactive) {
      return res.status(200).json({
        msg: "Interactive  is empty.",
        status: "0",
        interactive: inter,
      });
    }
    let newArr = [...new Set(interactive.media)];
    interactive.media = newArr;
    await interactive.save();
    res.status(200).json({ msg: "interactive found", interactive });
  } catch (error) {
    next(error);
  }
};

export const AddMedia: RequestHandler = async (req, res, next) => {
  try {
    const userID = res.locals.user._id;
    const array: [string] = req.body.array;
    if (!array) {
      return res
        .status(400)
        .json({ msg: "Please at least one media data ", status: "0" });
    }
    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({ msg: "Invalid user ID", status: "0" });
    }
    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(400).json({ msg: "Cannot find user", status: "0" });
    }
    if (!user.interactive) {
      const interactive = new InteractiveModel({
        user_id: userID,
        media: array,
      });
      user.interactive = interactive._id;
      await interactive.save();
    } else {
      const interactive = await InteractiveModel.findById(user.interactive);
      if (!interactive) {
        return res
          .status(400)
          .json({ msg: "Cannot find interactive", status: "0" });
      }
      for (const media of array) {
        interactive.media.push(media);
      }
      await interactive.save();
      user.interactive = interactive._id;
    }

    await user.save();
    res.status(200).json({ msg: "Interactive media is added.", status: "1" });
  } catch (error) {
    next(error);
  }
};

export const RemoveMedia: RequestHandler = async (req, res, next) => {
  try {
    const userID = res.locals.user._id;
    const media_id = req.params.id;

    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({ msg: "Invalid user  ID", status: "0" });
    }
    if (!mongoose.isValidObjectId(media_id)) {
      return res.status(400).json({ msg: "Invalid  nedia ID", status: "0" });
    }
    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(400).json({ msg: "Cannot find user", status: "0" });
    }

    const interactive = await InteractiveModel.findById(user.interactive);
    if (!interactive) {
      return res
        .status(400)
        .json({ msg: "Cannot find interactive", status: "0" });
    }

    const array = interactive.media.filter((e) => e != media_id);
    interactive.media = array;
    await interactive.save();
    res.status(200).json({ msg: "Media removed", interactive, status: "1" });
  } catch (error) {
    next(error);
  }
};

export const PlayInteractive: RequestHandler = async (req, res, next) => {
  try {
    const userID = res.locals.user._id;
    const media_id = req.params.id;

    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({ msg: "Invalid user  ID", status: "0" });
    }
    if (!mongoose.isValidObjectId(media_id)) {
      return res.status(400).json({ msg: "Invalid  nedia ID", status: "0" });
    }
    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(400).json({ msg: "Cannot find user", status: "0" });
    }

    const media = await mediaModel.findById(media_id);
    if (!media) {
      return res.status(400).json({ msg: "media not found", status: "0" });
    }

    for (const device_id of user.device_id) {
      const device = await deviceModel.findById(device_id);
      if (!device) {
        return res.status(400).json({ msg: "Device not found", status: "0" });
      }

      device.interactive = media.media;
      await device.save();
    }
    res.status(200).json({ msg: "Interactive is Playing", status: "1" });
  } catch (error) {
    next(error);
  }
};
