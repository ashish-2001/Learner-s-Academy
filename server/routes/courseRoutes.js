import express from "express";
const router = express.Router();


router.post("/createCourse", isInstructor, createCourse);

router.put("/updateCourse", isInstructor, updateCourse);

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

router.get("/getCourseProgress", getCourseProgress);


export {
    router
}