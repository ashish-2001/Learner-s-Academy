import express from "express";
import { capturePayment, sendPaymentSuccessfulEmail, verifyPayment } from "../controllers/Payment.js";
import { auth, isStudent } from "../middleware/auth.js";
const router = express.Router();

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, verifyPayment);
router.post("/sendPaymentSuccessfulEmail", auth, sendPaymentSuccessfulEmail)

export {
    router
}