import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  isVeg: { type: Boolean, default: true }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

export const Category = mongoose.model("Category", categorySchema);
