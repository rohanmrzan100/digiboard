import mongoose from "mongoose";

interface Media {
  _id: string;
  media: string;
  type: string;
  name:string;
  playlist:[string];
}

const mediaSchema = new mongoose.Schema(
  {
    media: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
 
    name: {
      type: String,
      required: true,
    },
    playlist: [{ type: mongoose.Types.ObjectId, ref: "playlist" }],
  },
  {
    timestamps: true,
  }
);

const mediaModel = mongoose.model<Media>("media", mediaSchema);
export default mediaModel;
export { Media };
