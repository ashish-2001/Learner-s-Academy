import express from "express";
import { updateProfile, deleteAccount, getUserDetails, getEnrolledCourses, instructorDashboard, updateDisplayPicture } from "../controllers/Profile.js";
import { auth, isInstructor } from "../middleware/auth.js";
const router = express.Router();

router.delete("/deleteProfile", auth, deleteAccount);

router.put("/updateProfile", auth, updateProfile);

router.get("/getUserDetails", auth, getUserDetails);

router.get("/getEnrolledCourses", auth, getEnrolledCourses);

router.put("/changeProfileImage",auth, updateDisplayPicture);

router.get("/getInstructorDashboard", auth, isInstructor, instructorDashboard);

export {
    router
}