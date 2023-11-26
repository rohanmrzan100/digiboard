import mongoose from "mongoose";

interface UniqueID {
  _id: string;
 uid:string
}

const uidSchema = new mongoose.Schema(
  {
  
    uid: String,
  },
  {
    timestamps: true,
  }
);

const uidModel = mongoose.model<UniqueID>("uids", uidSchema);
export default uidModel;
export { UniqueID };
