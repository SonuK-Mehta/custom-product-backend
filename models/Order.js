import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartId: {
      // Track which cart this order came from
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // Made required
        name: { type: String }, // Store product name at time of purchase
        image: { type: String }, // Store product image at time of purchase
      },
    ],
    shippingAddress: {
      type: {
        // Fixed structure
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, default: "India" },
      },
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["COD", "Card", "UPI", "NetBanking"], // Specific payment methods
    },
    paymentStatus: {
      // Added payment tracking
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending", // Capitalized to match enum
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
