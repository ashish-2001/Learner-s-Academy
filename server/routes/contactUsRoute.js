import express from "express";
import { contactUs } from "../controllers/ContactUs.js";

const router = express.Router();

router.post("/contactUs", contactUs);

export {
    router
};