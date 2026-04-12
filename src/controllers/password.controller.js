import User from "../models/user.js";
import bcrypt from "bcrypt";
import { sendOtpMail } from "../services/mail.service.js";

/* =======================
   SEND OTP
======================= */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("pages/forgot-password", {
        error: "Email not found"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    try {
      await sendOtpMail(email, otp);
    } catch (mailErr) {
      console.error("MAIL ERROR:", mailErr);
      return res.render("pages/forgot-password", {
        error: "Unable to send OTP. Try again later."
      });
    }

    return res.render("pages/reset-password", {
      email,
      error: null,
      success: null
    });

  } catch (err) {
    console.error(err);
    return res.render("pages/forgot-password", {
      error: "Something went wrong"
    });
  }
};

/* =======================
   VERIFY OTP & RESET PASSWORD
======================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });
    if (
      !user ||
      user.resetOtp !== otp ||
      Date.now() > user.resetOtpExpiry
    ) {
      return res.render("pages/reset-password", {
        email,
        error: "Incorrect or expired OTP",
        success: null
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    return res.render("pages/reset-password", {
      email,
      error: null,
      success: "Password reset successful. You can now login."
    });

  } catch (err) {
    console.error(err);
    return res.render("pages/reset-password", {
      email: req.body.email,
      error: "Something went wrong",
      success: null
    });
  }
};
