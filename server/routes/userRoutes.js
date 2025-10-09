import express from "express";
import { changePassword, sendOtp, signIn, signUp } from "../controllers/Auth.js";
import { auth } from "../middleware/auth.js";
import { resetPassword, resetPasswordToken } from "../controllers/ResetPassword.js";



const router = express.Router();


router.post("/signup", signUp);

router.post("/login", signIn);

router.post("/sendotp", sendOtp);

router.post("/change-password", auth, changePassword);

router.post("/reset-password", resetPassword);

router.post("/reset-password-token", resetPasswordToken);


export {
    router
}