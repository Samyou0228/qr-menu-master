import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

export const SubCategory = mongoose.model("SubCategory", subCategorySchema);
