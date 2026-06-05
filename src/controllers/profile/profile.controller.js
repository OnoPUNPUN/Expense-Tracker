import * as profileService from "../../services/profile/profile.service.js";

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
        const updatedUser = await profileService.updateUserProfile(
            req.userId,
            req.body
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