import express from "express";
import { updateProfile } from "../controllers/Profile.js";
import { deleteAccount, getAllUserDetails, getEnrolledCourses, instructorDashboard, updateDisplayPicture } from "../controllers/Profile.js";
import { auth, isInstructor } from "../middleware/auth.js";
const router = express.Router();


router.delete("/deleteProfile", auth, deleteAccount);

router.put("/updateProfile", auth, updateProfile);

router.get("/getUserDetails", auth, getAllUserDetails);

router.get("/getEnrolledCourses", auth, getEnrolledCourses);

router.put("/changeProfileImage",auth, updateDisplayPicture);

router.get("/getInstructorDashboard", isInstructor, instructorDashboard);

export {
    router
}