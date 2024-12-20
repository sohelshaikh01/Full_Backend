import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1 // how many file
        },
        {
            name: "coverImage",
            maxCount: 1
        },

    ]), // accepts array
    registerUser
);

// post - information taking
router.route("/login").post(loginUser);


// secured routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

// update routes
router.router("/update-password").post(verifyJWT, changeCurrentPassword);

router.router("/get-user").post(verifyJWT, getCurrentUser);

router.router("/update-details").post(verifyJWT, updateAccountDetails);

router.router("/update-avatar").post(verifyJWT, updateUserAvatar);

router.router("/update-coverimage").post(verifyJWT, updateUserCoverImage);



export default router;