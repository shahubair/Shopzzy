import express from "express";
import {
  showLogin,
  showSignup,
  signup,
  login,
  logout,
  verifySignupOtp
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/login", showLogin);
router.get("/signup", showSignup);
router.post("/verify-signup", verifySignupOtp);
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

export default router;
