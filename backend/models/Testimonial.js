import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  text:   { type: String, required: true },
  author: { type: String, required: true },
});

export default mongoose.model("Testimonial", testimonialSchema);