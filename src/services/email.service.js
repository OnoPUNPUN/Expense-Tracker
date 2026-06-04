import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email, otp) => {
    await resend.emails.send({
        from: "ExpenseEase <otp@verify.expenseease.com>",
        to: email,
        subject: "Your OTP Code",
        html: `
            <h2>Email Verification</h2>
            <h1>${otp}</h1>
        `
    });
};