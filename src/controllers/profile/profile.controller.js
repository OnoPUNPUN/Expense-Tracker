import * as profileService from "../../services/profile/profile.service.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";

export const getUserProfile = async (req, res) => {
    try {
        const user = await profileService.getUserProfile(
            req.userId
        );

        return res.status(200).json({user});
    } catch (err) {
        console.error("Error While Getting Profile: ", err);
        res.status(err.statusCode || 500).json({
            message: err.message || "Failed to Get Profile"
        });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const updateData = req.body;

        if (req.file) {
            const result = await uploadToCloudinary(req.file);
            updateData.avatarUrl = result.secure_url;
        }

        const updatedUser = await profileService.updateUserProfile(
            req.userId,
            updateData
        );

        return res.status(200).json({
            message: "Profile updated successfully",
            updatedUser
        });
    } catch (err) {
        console.error("Error While Updating Profile: ", err);
        res.status(err.statusCode || 500).json({
            message: err.message || "Failed to Update Profile"
        });
    }
}