import * as authService from "../services/auth.service.js";

export const register = async (req, res) => {
    try {
        const result = await authService.registerUser(req.body);

        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const result = await authService.loginUser(req.body);

        res.json(result);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const result = await authService.verifyOTP(req.body);

        res.json(result);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};