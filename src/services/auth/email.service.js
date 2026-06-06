/**
 * DEPRECATED: Email functionality has been removed.
 * OTP is now returned directly in the API response for development purposes.
 * 
 * For production email functionality, integrate with an email service
 * (Brevo, SendGrid, etc.) at the appropriate endpoint.
 */

/*
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

export const sendOTPEmail = async (email, otp) => {
    await transporter.sendMail({
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
};
*/

// This file is kept for reference only and can be deleted if no other modules depend on it.