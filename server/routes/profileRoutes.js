import express from "express";
const router = express.Router();


router.delete("/deleteProfile", auth, deleteProfile);

router.put("/updateProfile", auth, updateProfile);

router.get("/getUserDetails", auth, getAllUserDetails);

router.get("/getEnrolledCourses", auth, getEnrolledCourses);

router.put("/changeProfileImage",auth, changeProfileImage);

router.get("/getInstructorDashboard", isInstructor, getInstructorDashboard);

export {
    router
}