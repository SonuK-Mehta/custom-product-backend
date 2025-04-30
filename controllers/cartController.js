import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Add to cart or update quantity
export const addToCart = async (req, res) => {
  const { productId, quantity, customText } = req.body;

  try {
    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find or create cart (using userId from schema)
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [{ productId, quantity, customText: customText || "" }],
      });
    } else {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Update quantity if product exists
        cart.items[itemIndex].quantity += quantity;
        if (customText !== undefined) {
          cart.items[itemIndex].customText = customText;
        }
      } else {
        // Add new item if product doesn't exist
        cart.items.push({ productId, quantity, customText: customText || "" });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: "items.productId",
      select: "name price images", // Specify only needed fields
    });

    if (!cart) return res.status(200).json({ items: [] });

    res.status(200).json({
      ...cart.toObject(),
      items: cart.items.map((item) => ({
        ...item.toObject(),
        product: item.productId, // Rename for frontend consistency
        productId: undefined, // Remove duplicate field
      })),
    });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Cart Item Quantity
export const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity, customText } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (!item)
      return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    item.customText = customText;

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove Item from Cart
export const removeCartItem = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user._id }); // Changed to userId
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Remove Cart Item Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
