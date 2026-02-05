import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  isVeg: { type: Boolean, default: true },
  amount: { type: Number, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
  isAvailable: { type: Boolean, default: true }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

export const Item = mongoose.model("Item", itemSchema);
