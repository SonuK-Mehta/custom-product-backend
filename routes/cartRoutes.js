import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.patch("/update/:productId", protect, updateCartItem);
router.delete("/remove/:productId", protect, removeCartItem);

export default router;
