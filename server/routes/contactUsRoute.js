import express from "express";
import { contactUsController } from "../controllers/ContactUs.js";
const router = express.Router();


router.post("/contactUs", contactUsController);

export {
    router
}