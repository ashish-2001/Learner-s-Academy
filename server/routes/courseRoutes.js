import express from "express";
import { auth, isInstructor, isStudent } from "../middleware/auth.js";
import { createCourse, deleteCourse, editCourse, getAllCourses, getCourseDetails, getFullCourseDetails, getInstructorCourses, getReviews, showAllCategories } from "../controllers/Course.js";
import { createSection, deleteSection, updateSection } from "../controllers/Section.js";
import { createSubSection, deleteSubSection, updateSubSection } from "../controllers/SubSection.js";
import { updateCourseProgress } from "../controllers/CourseProgress.js";


const router = express.Router();

router.post("/createCourse", auth, isInstructor, createCourse);

router.put("/updateCourse", auth, isInstructor, editCourse);

router.delete("/deleteCourse/:courseId", auth, isInstructor, deleteCourse);

router.post("/createSection", auth, isInstructor, createSection);

router.put("/updateSection/:sectionId", auth, isInstructor, updateSection);

router.delete("/deleteSection/:sectionId", auth, isInstructor, deleteSection);

router.post("/createSubSection", auth, isInstructor, createSubSection);

router.put("/updateSubSection/:subSectionId", auth, isInstructor, updateSubSection);

router.delete("/deleteSubSection/:subSectionId", auth, isInstructor, deleteSubSection);

router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);

router.get("/getAllCourses", getAllCourses);

router.get("/getCourseDetails/:courseId", getCourseDetails);

router.get("/getFullCourseDetails/:courseId", auth, getFullCourseDetails);

router.get("/showAllCategories", showAllCategories);

router.get("/getReviews/:courseId", getReviews);

router.put("/updateCourseProgress", auth, isStudent, updateCourseProgress)



export {
    router
}