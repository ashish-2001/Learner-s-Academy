import express from "express";
import { capturePayment, sendPaymentSuccessfulEmail, verifyPayment } from "../controllers/Payment.js";
import { auth, isStudent } from "../middleware/auth.js";
const router = express.Router();

router.post("/capturePayment", capturePayment);
router.post("/verifyPayment", verifyPayment);
router.post("/sendPaymentSuccessfulEmail", auth, isStudent, sendPaymentSuccessfulEmail)

export {
    router
}