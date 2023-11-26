import "dotenv/config";
import env from "../env";
import { RequestHandler } from "express";
import userModel from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/User";
import mediaModel from "../models/Media";
const path = require("path");
const fs = require("fs");

// @route      /api/user/
// @desc       test protected route
// @auth       private
export const getUserData: RequestHandler = async (req, res, next) => {
  let doc: User = {
    _id: "",
    email: "",
    name: "",
    password: "",
    device_id: [""],
    media_id: [""],
    playlist: [""],
    group: [""],
    interactive:""
  };

  const userID = res.locals.user._id;
  if (!mongoose.isValidObjectId(userID)) {
    return res
      .status(400)
      .json({ msg: "Invalid user ID", status: "0", doc: doc });
  }
  const user = await userModel
    .findById(userID)
    .populate("media_id")
    .populate("playlist")
    .populate("interactive");
  if (!user) {
    return res
      .status(400)
      .json({ msg: "Cannot find user", status: "0", doc: user });
  }
  res.status(200).json({ doc: user, msg: "User Found", status: "1" });
};

// @route      /api/user/register
// @desc       register users
// @auth       public
interface registerBody {
  name?: string;
  email?: string;
  password?: string;
}

export const register: RequestHandler<
  unknown,
  unknown,
  registerBody,
  unknown
> = async (req, res, next) => {
  let doc: User = {
    _id: "",
    email: "",
    name: "",
    password: "",
    device_id: [""],
    group:[""],
    media_id: [""],
    playlist: [""],
    interactive: "",
  };

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        msg: "Please provide all required data",
        status: "0",
        doc,
      });
    }
    const checkUser = await userModel.findOne({ email: email });
    if (checkUser)
      return res
        .status(400)
        .json({ msg: "Email is already taken.", status: "0", doc });

    const salt = bcrypt.genSaltSync(10);
    const Hashpassword = bcrypt.hashSync(password, salt);

    const user = new userModel({
      name: name,
      email: email,
      password: Hashpassword,
      interactive:null
    });

    doc = await user.save();

    res.status(201).json({ doc, status: "1", msg: "Register success" });
  } catch (error) {
    next(error);
  }
};

// @route      /api/user/login
// @desc       login users
// @auth       public
interface loginBody {
  email: string;
  password: string;
}
export const login: RequestHandler<unknown, unknown, loginBody> = async (
  req,
  res,
  next
) => {
  let doc: User = {
    _id: "",
    email: "",
    name: "",
    password: "",
    device_id: [""],
    media_id: [""],
    playlist: [""],
    group: [""],
    interactive: "",
  };

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide all required data", status: "0" });
    }
    const user = await userModel.findOne({ email: email });
    if (user) {
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ msg: "Password is incorrect", status: "0" });
      }
      const token = jwt.sign({ _id: user._id, name: user.name }, env.SECRET, {
        expiresIn: "30d",
      });
      return res.status(200).json({
        msg: "Login Successful",
        token: token,
        status: "1",
        doc: user,
      });
    }
    res.status(400).json({ msg: "Email not found.", status: "0", doc });
  } catch (error) {
    next(error);
  }
};

// @route      /api/user/view_devices
// @desc      view user added devices
// @auth       private
export const viewAllDevices: RequestHandler = async (req, res, next) => {
  try {
    const userID = res.locals.user._id;
    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({ msg: "Invalid user ID", status: "0" });
    }
    const user = await userModel.findById(userID).populate("device_id");

    if (!user) {
      return res.status(400).json({ msg: "User Not found", status: "0" });
    }
    res.status(200).json({ devices: user.device_id, status: "1" });
  } catch (error) {
    next(error);
  }
};

// @route      /api/user/delete_media/:id
// @desc       get all users
// @auth       public

export const deleteMedia: RequestHandler = async (req, res, next) => {
  try {
    let user = await userModel.findById(res.locals.user._id);
    if (!user) {
      return res.status(400).json({ msg: "User Not Found", status: "0" });
    }

    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ error: "media Id is invalid", status: "0" });
    }
    const media = await mediaModel.findById(id);
    if (!media) {
      return res.status(404).json({ msg: "media not found", status: "0" });
    }

    if (media.playlist.length > 0) {
      return res.status(400).json({
        msg: "This media is present in one of the playlist so it cannot be deleted.",
        status: "0",
      });
    }
    await userModel.updateOne(
      {
        _id: res.locals.user._id,
      },
      {
        $pull: { media_id: id },
      }
    );
    //deleting media from public/asset folder
    fs.unlinkSync(
      path.join(__dirname + "../../../public/assets/" + media.media)
    );
  
    await mediaModel.findByIdAndDelete(id);

    res.status(200).json({ msg: "Media is deleted", status: "1" });
  } catch (error) {
    next(error);
  }
};

// @route      /api/user/all
// @desc       get all users
// @auth       public

export const getAllUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await userModel.find();
    res.status(400).json({ user, status: "1" });
  } catch (error) {
    next(error);
  }
};
