import express from "express";
import { isInstructor } from "../middleware/auth";
import { createCourse, deleteCourse, editCourse, getAllCourses, getCourseDetails, getFullCourseDetails, getInstructorCourses } from "../controllers/Course";
import { createSection, deleteSection, updateSection } from "../controllers/Section";
import { createSubSection, deleteSubSection, updateSubSection } from "../controllers/SubSection";
const router = express.Router();


router.post("/createCourse", isInstructor, createCourse);

router.put("/updateCourse", isInstructor, editCourse);

router.delete("/deleteCourse", isInstructor, deleteCourse);

router.post("/createSection", isInstructor, createSection);

router.put("/updateSection", isInstructor, updateSection);

router.delete("/deleteSection", isInstructor, deleteSection);

router.post("/createSubSection", isInstructor, createSubSection);

router.put("/updateSubSection", isInstructor, updateSubSection);

router.delete("/deleteSubSection", isInstructor, deleteSubSection);

router.get("/getInstructorCourses", isInstructor, getInstructorCourses);

router.get("/getAllCourses", getAllCourses);

router.get("/getCourseDetails", getCourseDetails);

router.get("/getFullCourseDetails", getFullCourseDetails);



export {
    router
}