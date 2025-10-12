import express from "express";
import { changePassword, sendOtp, signIn, signUp } from "../controllers/Auth.js";
import { auth } from "../middleware/auth.js";
import { resetPassword, resetPasswordToken } from "../controllers/ResetPassword.js";



const router = express.Router();


router.post("/signup", signUp);

router.post("/login", signIn);

router.post("/sendotp", sendOtp);

router.put("/changepassword", auth, changePassword);

router.post("/resetpassword", resetPassword);

router.post("/resetpasswordtoken", resetPasswordToken);


export {
    router
}