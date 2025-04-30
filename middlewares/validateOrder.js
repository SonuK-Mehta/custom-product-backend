// backend/middleware/validateOrder.js
import { body } from "express-validator";

export const validateOrder = [
  body("shippingAddress.line1")
    .notEmpty()
    .withMessage("Address line 1 is required"),
  body("shippingAddress.city").notEmpty().withMessage("City is required"),
  body("shippingAddress.state").notEmpty().withMessage("State is required"),
  body("shippingAddress.zip").notEmpty().withMessage("ZIP code is required"),
  body("paymentMethod")
    .isIn(["COD", "Card", "UPI", "NetBanking"])
    .withMessage("Invalid payment method"),
];
