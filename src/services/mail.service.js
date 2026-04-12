import nodemailer from "nodemailer";

export const sendOtpMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // IMPORTANT
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  await transporter.sendMail({
    from: `"Shopzy" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Shopzy Password Reset OTP",
    html: `
      <h2>Password Reset</h2>
      <p>Your OTP:</p>
      <h1>${otp}</h1>
      <p>Valid for 10 minutes</p>
    `
  });
};
