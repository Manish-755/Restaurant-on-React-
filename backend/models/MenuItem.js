import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  category: { type: String, required: true },
  veg:      { type: Boolean, required: true },
  img:      { type: String, default: "" },
});

export default mongoose.model("MenuItem", menuItemSchema);