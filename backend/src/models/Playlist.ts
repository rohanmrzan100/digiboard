import mongoose from "mongoose";

interface Playlist {
  _id: string;
  media: [string];
  device: [string];
  name: string;
}

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    media: [{ type: mongoose.Types.ObjectId, ref: "media" }],
    
    device: [{ type: mongoose.Types.ObjectId, ref: "device" }],
  },

  {
    timestamps: true,
  }
);

const playlistModel = mongoose.model<Playlist>("playlist", playlistSchema);
export default playlistModel;
export { Playlist };
