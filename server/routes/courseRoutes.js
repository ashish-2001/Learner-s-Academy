import express from "express";
import { auth, isInstructor, isStudent, isAdmin } from "../middleware/auth.js";
import { createCourse, deleteCourse, editCourse, getAllCourses, getCourseDetails, getFullCourseDetails, getInstructorCourses, markLectureAsComplete, searchCourse } from "../controllers/Course.js";
import { categoryPageDetails, showAllCategories, createCategory, addCourseToCategory } from "../controllers/Category.js"
import { createSection, deleteSection, updateSection } from "../controllers/Section.js";
import { createSubSection, deleteSubSection, updateSubSection } from "../controllers/SubSection.js";
import { createRating, getAverageRating, getAllRating } from "../controllers/RatingAndReview.js";


const router = express.Router();

router.post("/createCourse", auth, isInstructor, createCourse);
router.put("/updateCourse", auth, isInstructor, editCourse);
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);

router.post("/addSection", auth, isInstructor, createSection);
router.put("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection", auth, isInstructor, deleteSection);

router.post("/addSubSection", auth, isInstructor, createSubSection);
router.put("/updateSubSection", auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection);

router.get("/getAllCourses", getAllCourses);
router.get("/getCourseDetails", getCourseDetails);
router.post("/editCourse", auth, isInstructor, editCourse)

router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.get("/getFullCourseDetails", auth, getFullCourseDetails);


router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);
router.post("/addCourseToCategory", auth, isInstructor, addCourseToCategory);

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

router.post("/searchCourse", searchCourse);
router.post("/updateCourseProgress", auth, isStudent, markLectureAsComplete);



export {
    router
}