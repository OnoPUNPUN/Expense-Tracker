import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/prismaClinet.js";
import { saveOTP, getOTP, deleteOTP } from "./otp.service.js";
import { generateOTP } from "../../utils/generateOtp.js";

export const registerUser = async ({
    username,
    email,
    password
}) => {
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username },
                { email }
            ]
        }
    });

    if (existingUser) {
        throw new Error("Username or email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            isVerified: false
        }
    });

    const otp = generateOTP();
    console.log("OTP generated");

    await saveOTP(email, otp);
    console.log("OTP saved to Redis");

    return {
        message: "OTP generated successfully",
        email,
        otp
    };
};

export const verifyOTP = async ({ email, otp }) => {
    const storedOTP = await getOTP(email);

    if (!storedOTP || storedOTP !== otp) {
        throw new Error("Invalid or expired OTP");
    }

    await prisma.user.update({
        where: { email },
        data: { isVerified: true }
    });

    await deleteOTP(email);

    return {
        message: "Email verified successfully"
    };
};

export const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    if (!user.isVerified) {
        throw new Error("Please verify your email before logging in");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        message: "Login successful",
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl
        }
    };
};
