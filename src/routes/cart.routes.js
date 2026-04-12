import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  addToCart,
  showCart,
  removeFromCart
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/cart", protect, showCart);
router.get("/cart/add/:id", protect, addToCart);
router.get("/cart/remove/:id", protect, removeFromCart);

export default router;
