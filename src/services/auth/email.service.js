import nodemailer from "nodemailer";

console.log("EMAIL:", process.env.EMAIL);
console.log(
  "EMAIL_APP_PASSWORD exists:",
  !!process.env.EMAIL_APP_PASSWORD
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },

  // Debug timeouts
  connectionTimeout: 10000, // 10 sec
  greetingTimeout: 10000,
  socketTimeout: 10000,

  logger: true,
  debug: true,
});

export const verifySMTPConnection = async () => {
  try {
    console.log("🔍 Verifying SMTP connection...");

    await transporter.verify();

    console.log("✅ SMTP connection successful");
  } catch (error) {
    console.error("❌ SMTP VERIFY ERROR:");
    console.error(error);
  }
};

export const sendOTPEmail = async (email, otp) => {
  try {
    console.log("📧 Starting email send...");
    console.log("📧 To:", email);

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 5 minutes.</p>
      `,
    });

    console.log("✅ Email sent successfully");
    console.log("Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ EMAIL SEND ERROR:");
    console.error(error);

    throw error;
  }
};