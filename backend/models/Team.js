import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  img:  { type: String, default: "" },
});

export default mongoose.model("Team", teamSchema);