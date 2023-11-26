import mongoose from "mongoose";

interface Interactive {
  _id: string;
  user_id: string;
  media: string[];
}

const interactiveSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },

    media: [{ type: mongoose.Types.ObjectId, ref: "media" }],
  },
  {
    timestamps: true,
  }
);

const InteractiveModel = mongoose.model<Interactive>(
  "interactive",
  interactiveSchema
);
export default InteractiveModel;
export { Interactive };
