import prisma from "../../config/prismaClinet.js";
const createError = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

export const getUserProfile = async (userId) => {
    if (!userId) {
        throw createError("Unauthorized", 401);
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            username: true,
            email: true,
            avatarUrl: true
        }
    });

    if (!user) {
        throw createError("User not found", 404);
    }

    return user;
};

export const updateUserProfile = async (userId, data) => {
    if (!userId) {
        throw createError("Unauthorized", 401);
    }

    if (!data || Object.keys(data).length === 0) {
        throw createError("No data provided to update", 400);
    }

    const allowedFields = ["username", "avatarUrl"];
    const updatedData = {};

    for (const field of allowedFields) {
        if (field in data) {
            updatedData[field] = data[field];
        }
    }

    if (Object.keys(updatedData).length === 0) {
        throw createError("No valid profile fields provided", 400);
    }

    try {
        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: updatedData,
            select: {
                id: true,
                username: true,
                email: true,
                avatarUrl: true
            }
        });

        return user;
    } catch (error) {
        if (error.code === "P2025") {
            throw createError("User not found", 404);
        }

        if (error.code === "P2002") {
            throw createError("Username or email already exists", 409);
        }

        throw error;
    }
};
