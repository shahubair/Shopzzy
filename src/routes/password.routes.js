import express from "express";
import { sendOtp, resetPassword } from "../controllers/password.controller.js";

const router = express.Router();

/* GET forgot password page */
router.get("/forgot-password", (req, res) => {
  res.render("pages/forgot-password", { error: null });
});

/* POST send OTP */
router.post("/forgot-password", sendOtp);

/* POST reset password */
router.post("/reset-password", resetPassword);

export default router;
