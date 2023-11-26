import mongoose from "mongoose";

interface Device {
  _id: string;
  name: string;
  uid: string;
  owner_id: string;
  interactive?: string;
  c_playlist: string;
  a_playlist: [string];
  change: boolean;
  SFD_playlist: [string];
  SFR_playlist: [string];
  playlistChange: [
    {
      name: string;
      added?: {
        name: string;
        media: string;
      };

      remove?: {
        name: string;
        media: string;
      };
    }
  ];
}

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    uid: {
      type: String,
      required: true,
    },
    interactive: {
      type: String,
    },
    change: {
      type: Boolean,
      default: false,
    },

    owner_id: { type: mongoose.Types.ObjectId, ref: "user" },
    //current playing playlist
    c_playlist: { type: String },
    //assigned playist
    a_playlist: [{ type: mongoose.Types.ObjectId, ref: "playlist" }],

    //playlist sent for download in device
    SFD_playlist: [String],

    //playlist sent for removal from device
    SFR_playlist: [String],
    //change in playlist media
    playlistChange: [
      {
        name: String,
        added: {
          name: String,
          media: String,
        },

        remove: {
          name: String,
          media: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const deviceModel = mongoose.model<Device>("device", deviceSchema);
export default deviceModel;
export { Device };
