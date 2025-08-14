import express from "express";
import { register, login } from "../controllers/authController.js";
import { registerValidation } from "../validation/registerValidation.js";

const router = express.Router();

router.post("/signup", registerValidation, register);
router.post("/login", login);

export default router;
