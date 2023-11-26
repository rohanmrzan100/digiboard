import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
  {
    media: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    //   required: true,
    },
    thumbnail: {
      type: String,
    //   required: true,
    },
    name: {
      type: String,
      required: true,
    },
    playlist: [{ type: mongoose.Types.ObjectId, ref: "playlist" }],
  },
  { timestamps: true }
);

const uploadModel = mongoose.model("upload", uploadSchema);
export default uploadModel;
