import express from "express";
const router = express.Router();

import { contactUs } from "../controllers/ContactUs.js";


router.post("/contactUs", contactUs);

export {
    router
}