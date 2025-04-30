import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

// Place Order
export const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;

    // Validate input
    if (!shippingAddress || !paymentMethod) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Shipping address and payment method are required",
      });
    }

    const cart = await Cart.findOne({ userId })
      .populate("items.productId")
      .session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Your cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = [];
    const outOfStockItems = [];

    // Process each item
    for (const item of cart.items) {
      const product = item.productId;
      const quantity = item.quantity;

      if (product.stockQuantity < quantity) {
        outOfStockItems.push(product.name);
        continue;
      }

      product.stockQuantity -= quantity;
      await product.save({ session });

      orderItems.push({
        productId: product._id,
        name: product.name,
        image: product.images[0],
        quantity,
        price: product.price,
      });

      totalAmount += product.price * quantity;
    }

    // Check if any items were out of stock
    if (outOfStockItems.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Some items are out of stock",
        outOfStockItems,
      });
    }

    // Validate minimum order amount
    if (totalAmount < 100) {
      // Example: ₹100 minimum
      await session.abortTransaction();
      return res.status(400).json({
        message: "Minimum order amount is ₹100",
      });
    }

    // Create order
    const newOrder = await Order.create(
      [
        {
          userId,
          cartId: cart._id,
          items: orderItems,
          shippingAddress,
          paymentMethod,
          paymentStatus: paymentMethod === "COD" ? "Pending" : "Completed",
          totalAmount,
        },
      ],
      { session }
    );

    // Clear cart
    await Cart.findByIdAndUpdate(cart._id, { items: [] }, { session });

    await session.commitTransaction();

    // Send confirmation email (pseudo-code)
    // await sendOrderConfirmationEmail(req.user, newOrder[0]);

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder[0],
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("Order placement error:", err);

    if (err.code === 11000) {
      return res.status(409).json({
        message: "Duplicate order detected",
      });
    }

    res.status(500).json({
      message: "Failed to place order",
      error: process.env.NODE_ENV === "development" ? err.message : null,
    });
  } finally {
    session.endSession();
  }
};

// In your orderController.js

// GET /api/orders - Get all orders for current user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 }) // Newest first
      .populate("items.productId", "name price images");

    res.json({
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/orders/:id - Get single order details (existing)
export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("items.productId", "name price images");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Order Status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/orders/:id/cancel - Cancel order
export const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
      status: { $in: ["Pending", "Processing"] },
    }).session(session);

    if (!order) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Order cannot be cancelled at this stage",
      });
    }

    // Restock products
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: item.quantity } },
        { session }
      );
    }

    order.status = "Cancelled";
    await order.save({ session });

    await session.commitTransaction();

    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: "Failed to cancel order" });
  } finally {
    session.endSession();
  }
};
