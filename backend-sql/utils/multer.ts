import multer from "multer";
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }
    if (!fs.existsSync("public/assets")) {
      fs.mkdirSync("public/assets");
    }
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

export default upload;
