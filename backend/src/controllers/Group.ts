import { RequestHandler } from "express";
import mongoose from "mongoose";
import userModel from "../models/User";
import groupModel from "../models/Group";


// @route      /api/device/group/
// @desc       delete added devicess
// @auth       protected

export const createGroup: RequestHandler = async (req, res, next) => {
  try {
    const name = req.body.name;
    const array: [string] = req.body.array;
    if (!array || !name) {
      return res.status(400).json({ msg: "Please Provide all data " });
    }

    const userID = res.locals.user._id;
    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }
    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(400).json({ msg: "Cannot find user" });
    }

    const group = new groupModel({
      name: name,
      devices: array,
    });
    await group.save();
    user.group.push(group._id);
    await user.save();
    res.status(200).json({ msg: "Group is created." });
  } catch (error) {
    next(error);
  }
};


