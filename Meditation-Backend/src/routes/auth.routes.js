import express from "express";
import { body } from "express-validator";

import { verifyToken } from "../middleware/verifyToken.middleware.js";
import { getUser, loginUser, registerUser, refreshAccessToken } from "../controllers/auth.controller.js";

const router = express.Router();


router.route("/register").post(
    [
        body("userName", "Enter the user name !").exists(),
        body("email", "Enter a valid email !").isEmail(),
        body(
            "password",
            "The password should be atleast 6 characters long !"
        ).isLength({ min: 6 }),
    ],
    registerUser
);


router.route("/login").post([
    body('email', 'Enter a valid email !').isEmail(),
    body('password', 'Enter a valid password !').isLength({ min: 6 })
],
    loginUser
)

router.route("/refresh-token").post(refreshAccessToken)

// Secured Route
// Route3: Get user data using GET request
router.route("/get-user").get(verifyToken, getUser)


export const authRoute = router;