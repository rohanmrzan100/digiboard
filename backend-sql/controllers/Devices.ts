import "dotenv/config";
import env from "../env";
import { RequestHandler } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { Device } from "../utils/interface";

// @route      /api/device/generateuid
// @desc        generate unique token and store in DB for SYNC
// @auth       public
// player
export const generateUid: RequestHandler = async (req, res, next) => {
  try {
    function uniqueid() {
      let idstr = String.fromCharCode(Math.floor(Math.random() * 25 + 65));
      do {
        var ascicode = Math.floor(Math.random() * 42 + 48);
        if (ascicode < 58 || ascicode > 64) {
          idstr += String.fromCharCode(ascicode);
        }
      } while (idstr.length < 6);

      return idstr;
    }

    const code = uniqueid().toLocaleLowerCase();
    console.log(code);

    const uid = await prisma.uniqueId.create({
      data: {
        uid: code,
      },
    });

    res.status(200).json({ msg: "uid generated and stored in DB", uid: uid });
  } catch (error) {
    next();
  }
};

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
    const owner = await prisma.user.findUnique({
      where: {
        id: res.locals.user.id,
      },
    });

    if (!owner) {
      return res.status(400).json({ msg: "User is not found" });
    }
    console.log(owner);

    const { name, uid } = req.body;

    if (!name || !uid) {
      return res.status(400).json({ msg: "Please provide all required data" });
    }
    const checkuid = await prisma.uniqueId.findFirst({
      where: {
        uid: uid,
      },
    });

    if (!checkuid) {
      return res.status(400).json({ msg: "Invalid Code" });
    }
    const device = await prisma.device.create({
      data: {
        name: name,
        uid: uid,
        owner_id: owner.id,
        change: false,
      },
    });
    res.status(200).json({
      msg: "Device is added",
    });
  } catch (error) {
    next(error);
  }
};

// @route     /api/device/:id
// @desc      get devices
// @auth      protected
export const getDeviceById: RequestHandler = async (req, res, next) => {
  try {
    const device_id = req.params.id;

    const device = await prisma.device.findUnique({
      where: {
        id: device_id,
      },
    });
    if (!device) {
      return res.status(400).json({ msg: "Invalid device ID" });
    }

    res.status(200).json({ msg: "Device Found", device });
  } catch (error) {
    next();
  }
};

//player
export const syncDevice: RequestHandler = async (req, res, next) => {
  try {
    const uid = req.params.uid;

    let device = await prisma.device.findFirst({
      where: {
        uid: uid,
      },
    });
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
    const token = jwt.sign({ id: device.owner_id }, env.SECRET, {
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
