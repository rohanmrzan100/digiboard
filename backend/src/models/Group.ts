import mongoose from "mongoose";

interface Group {
  _id: string;
  name: string;
  devices: [string];
}

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    devices: [{ type: mongoose.Types.ObjectId, ref: "device" }],
  },
  {
    timestamps: true,
  }
);

const groupModel = mongoose.model<Group>("group", groupSchema);
export default groupModel;
export { Group };
