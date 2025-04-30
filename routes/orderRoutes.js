import express from "express";
import {
  placeOrder,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateOrder } from "../middlewares/validateOrder.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// POST /api/orders - Place new order
router.post("/", protect, validateOrder, placeOrder);

// GET /api/orders - Get user's orders
router.get("/", protect, getUserOrders);

// GET /api/orders/:id - Get single order details
router.get("/:id", protect, getOrderDetails);

// PATCH /api/orders/:id - Update order status (Admin only)
router.patch("/:id", protect, adminOnly, updateOrderStatus);

// POST /api/orders/:id/cancel - Cancel order
router.post("/cancel/:id", protect, cancelOrder);

export default router;
