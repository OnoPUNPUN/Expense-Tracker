import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASSWORD,
    },
});

// // Verify Brevo SMTP connection
// try {
//     await transporter.verify();
//     console.log("✅ Brevo SMTP Connected");
// } catch (error) {
//     console.error("❌ Brevo SMTP Error:", error);
// }

export const sendOTPEmail = async (email, otp) => {
    try {
        console.log("📧 Sending email...");

        const info = await transporter.sendMail({
            from: `ExpenseEase <${process.env.BREVO_FROM_EMAIL}>`,
            to: email,
            subject: "Your OTP Code",
            html: `
                <h2>Email Verification</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This code expires in 5 minutes.</p>
            `,
        });

        console.log("✅ Email sent:", info.messageId);
    } catch (error) {
        console.error("❌ SendMail Error:", error);
        throw error;
    }
};