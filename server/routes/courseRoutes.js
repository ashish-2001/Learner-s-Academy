import express from "express";
import { auth, isInstructor, isStudent } from "../middleware/auth.js";
import { createCourse, deleteCourse, editCourse, getAllCourses, getCourseDetails, getFullCourseDetails, getInstructorCourses, getReviews, showAllCategories } from "../controllers/Course.js";
import { createSection, deleteSection, updateSection } from "../controllers/Section.js";
import { createSubSection, deleteSubSection, updateSubSection } from "../controllers/SubSection.js";
import { updateCourseProgress } from "../controllers/CourseProgress.js";
import { RxShadowOuter } from "react-icons/rx";

const router = express.Router();


router.post("/createCourse", auth, isInstructor, createCourse);

router.put("/updateCourse", auth, isInstructor, editCourse);

router.delete("/deleteCourse", auth, isInstructor, deleteCourse);

router.post("/createSection", isInstructor, createSection);

router.put("/updateSection", auth, isInstructor, updateSection);

router.delete("/deleteSection", auth, isInstructor, deleteSection);

router.post("/createSubSection", auth, isInstructor, createSubSection);

router.put("/updateSubSection", auth, isInstructor, updateSubSection);

router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);

router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);

router.get("/getAllCourses", getAllCourses);

router.get("/getCourseDetails", getCourseDetails);

router.get("/getFullCourseDetails", auth, getFullCourseDetails);

router.get("/showAllCategories", showAllCategories);

router.get("/getReviews", getReviews);

router.put("/updateCourseProgress", auth, isStudent, updateCourseProgress)



export {
    router
}