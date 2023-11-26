import { RequestHandler } from "express";
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

import Ffmpeg from "fluent-ffmpeg";
Ffmpeg.setFfmpegPath(ffmpegPath);
const path = require("path");
const fs = require("fs");
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class userController {
  static fileUpload: RequestHandler = async (req, res, next) => {
    try {
      const owner = await prisma.user.findUnique({
        where: {
          id: res.locals.user.id,
        },
      });
      if (!owner) return res.status(400).json({ msg: "User is not found" });
      if (!req.file) {
        return res.status(400).json({ msg: "File not found" });
      }

      const media = await prisma.media.create({
        data: {
          name: req.file.originalname,
          type: req.file.mimetype.substring(0, 5),
          media: "compressed" + req.file.filename,
          owner_id: owner.id,
        },
      });
      await prisma.user.update({
        where: {
          id: res.locals.user.id,
        },
        data: {
          Media: {
            connect: {
              id: media.id,
            },
          },
        },
      });

      const inputFilePath = path.join(
        __dirname + "../../public/assets/" + req.file.filename
      );
      const outputFilePath = path.join(
        __dirname + "../../public/assets/compressed" + req.file.filename
      );

      if (media.type == "video") {
        await new Promise((resolve, reject) => {
         
          Ffmpeg(inputFilePath)
            // Generate 720P video
            .output(outputFilePath)
            .videoCodec("libx264")

            .size("640x480") // Adjust the resolution as desired
            .videoBitrate("300k") // Adjust the bitrate as desired

            .outputOptions("-crf 25")
            .on("progress", function (progress) {
              console.log("... frames: " + progress.frames);
            })

            .on("end", () => resolve("resolved"))
            .on("error", (error: any) => reject(new Error(error.message)))
            .run();
        }).then(() => {
          fs.unlinkSync(
            path.join(
              __dirname + "../../public/assets/" + media.media.slice(10)
            )
          );
        });
      } else {
        // Rename the file
        fs.rename(
          path.join(
            __dirname + "../../public/assets/" + media.media.slice(10)
          ),
          path.join(
            __dirname +
              "../../public/assets/compressed" +
              media.media.slice(10)
          ),
          () => {
            console.log("\nFile Renamed!\n");
          }
        );
      }

      res.status(200).json({ msg: "Media Uploaded", status: "1" });
    } catch (error) {
      next(error);
    }
  };
}

export default userController;
