import redisClient from "../config/redisClinet.js";

export const saveOTP = async (email, otp) => {
    await redisClient.set(
        `otp:${email}`,
        otp,
        { EX: 300 }
    );
};

export const getOTP = async (email) => {
    return await redisClient.get(`otp:${email}`);
};

export const deleteOTP = async (email) => {
    await redisClient.del(`otp:${email}`);
};
