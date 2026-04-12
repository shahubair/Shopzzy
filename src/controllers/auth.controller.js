import bcrypt from "bcrypt";
import User from "../models/user.js";
import { generateToken } from "../services/auth.service.js";
import { sendOtpMail } from "../services/mail.service.js";

/* ---------- SHOW PAGES ---------- */

export const showLogin = (req, res) => {
  res.render("pages/login", {
    error: req.query.error || null
  });
};

export const showSignup = (req, res) => {
  res.render("pages/signup", {
    error: req.query.error || null
  });
};

/* ---------- SIGNUP (SEND OTP) ---------- */

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect(
        "/signup?error=Email%20already%20registered"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      signupOtp: otp,
      signupOtpExpiry: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    await sendOtpMail(email, otp);

    res.render("pages/verify-signup", {
      email,
      error: null
    });

  } catch (err) {
    console.error(err);
    res.redirect("/signup?error=Something%20went%20wrong");
  }
};

/* ---------- VERIFY SIGNUP OTP ---------- */

export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      user.signupOtp !== otp ||
      Date.now() > user.signupOtpExpiry
    ) {
      return res.render("pages/verify-signup", {
        email,
        error: "Invalid or expired OTP"
      });
    }

    user.isVerified = true;
    user.signupOtp = undefined;
    user.signupOtpExpiry = undefined;

    await user.save();

    res.redirect(
      "/login?error=Account%20verified.%20Please%20login"
    );

  } catch (err) {
    console.error(err);
    res.redirect("/signup?error=Something%20went%20wrong");
  }
};

/* ---------- LOGIN ---------- */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect(
        "/login?error=Invalid%20email%20or%20password"
      );
    }

    if (!user.isVerified) {
      return res.redirect(
        "/login?error=Please%20verify%20your%20email"
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect(
        "/login?error=Invalid%20email%20or%20password"
      );
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false
    });

    res.redirect("/home");

  } catch (err) {
    console.error(err);
    res.redirect("/login?error=Something%20went%20wrong");
  }
};

/* ---------- LOGOUT ---------- */

export const logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};
