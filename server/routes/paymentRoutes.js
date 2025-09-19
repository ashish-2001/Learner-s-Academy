import express from "express";
const router = express.Router();

router.post("/capturePayment", capturePayment);
router.post("/verifyPayment", verifyPayment);
router.post("/sendPaymentSuccessfulEmail", auth, isStudent, sendPaymentSuccessfulEmail)

export {
    router
}