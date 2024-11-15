import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlreware/multer.middleware.js";

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

export default router;