import express from "express";
import {
  showAddProduct,
  addProduct,
  home
} from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/home", protect, home);

router.get("/products/add", protect, adminOnly, showAddProduct);
router.post("/products/add", protect, adminOnly, addProduct);

export default router;
