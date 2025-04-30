import Product from "../models/Product.js";

// Create a Product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res
      .status(200)
      .json({ success: true, message: "Product updated", product });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({
      success: true,
      Product: product.name,
      message: "Product deleted",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
