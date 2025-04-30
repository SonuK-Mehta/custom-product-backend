import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [String],
    category: { type: String },
    stockQuantity: { type: Number, default: 0 },
    customizable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
