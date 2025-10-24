import express from "express";
import { updateProfile, deleteAccount, getAllUserDetails, getEnrolledCourses, instructorDashboard, updateDisplayPicture } from "../controllers/Profile.js";
import { auth, isInstructor } from "../middleware/auth.js";
const router = express.Router();

router.delete("/deleteProfile", auth, deleteAccount);

router.put("/updateProfile", auth, updateProfile);

router.get("/getUserDetails", auth, getAllUserDetails);

router.get("/getEnrolledCourses", auth, getEnrolledCourses);

router.put("/updateDisplayPicture",auth, updateDisplayPicture);

router.get("/getInstructorDashboardDetails", auth, isInstructor, instructorDashboard);

export {
    router
}