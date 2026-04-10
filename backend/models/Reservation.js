import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  phone:  { type: String, required: true },
  date:   { type: String, required: true },
  time:   { type: String, required: true },
  guests: { type: Number, required: true },
  token:  { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model("Reservation", reservationSchema);