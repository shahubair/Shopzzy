import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/admin", protect, adminOnly, (req, res) => {
  res.send("Welcome Admin");
});

export default router;
