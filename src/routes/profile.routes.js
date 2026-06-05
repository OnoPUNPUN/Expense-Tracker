import express from "express";
import upload from "../middleware/uploadMiddleware.js";

import {
    getUserProfile,
    updateUserProfile
} from "../controllers/profile/profile.controller.js";

const router = express.Router();

router.get("/", getUserProfile);
router.put("/", upload.single("image"), updateUserProfile);

export default router;
