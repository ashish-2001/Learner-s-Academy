import { z } from "zod";
import { User } from "../models/Users.js";
import { Category } from "../models/Category.js";
import { Course } from "../models/Course.js";
import { Section } from "../models/Section.js";
import { SubSection } from "../models/SubSection.js";
import { convertSecondsToDuration } from "../utils/secToDuration.js";
import { uploadImageToCloudinary } from "../utils/ImageUploader.js";
import { CourseProgress } from "../models/CourseProgress.js";

const courseValidator = z.object({
    courseName: z.string().min(1, "Course name is required"),
    courseDescription: z.string().min(1, "Course description is required"),
    whatWillYouLearn: z.string().min(1, "Learning point is required"),
    price: z.number().positive("Price must be greater than 0"),
    tag: z.array(z.string()).nonempty( "At least one tag is required"),
    category: z.string().min(1, "Category is required"),
    status: z.string().optional(),
    instructions: z.array(z.string()).nonempty("Instruction is required")
    
});

const editCourseValidator = z.object({
    courseId: z.string().min(1, "CourseId is required"),
    courseName: z.string().optional(),
    courseDescription: z.string().optional(),
    whatWillYouLearn: z.string().optional(),
    price: z.string().optional(),
    tag: z.union([z.string(), z.array(z.string())]).optional(),
    category: z.string().optional(),
    status: z.string().optional(),
    instructions: z.union([z.string(), z.array(z.string())]).optional()
});


function parseJsonIfString(value){
    if(typeof value === "string"){
        return JSON.parse(value);
    }
    return value;
}


const createCourse = async (req, res) =>{

    const userId = req.user.userId;

    try{
        const parsedResult = courseValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                message: "Incorrect input",
                errors: parsedResult.error.errors
            })
        }

        let {
            courseName, 
            courseDescription,
            whatWillYouLearn,
            // price,
            tag: _tag,
            category,
            status,
            instructions: _instructions
        } = parsedResult.data;

        const tag = parseJsonIfString(_tag);
        const instructions = parseJsonIfString(_instructions);

        if(!status){
            status = "Draft";
        }

        const instructorDetails = await User.findById(userId, {
            accountType: "Instructor"
        })

        if(!instructorDetails){
            return res.status(403).json({
                success: false,
                message: "Instructor details not found!"
            })
        }

        const categoryDetails = await Category.findById(category);

        if(!categoryDetails){
            return res.status(403).json({
                success: false,
                message: "Category details not found"
            });
        }

        const thumbnail = req.files?.thumbnailImage;
        let thumbnailUrl = "";

        if(thumbnail){
            const uploadedImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)
            thumbnailUrl = uploadedImage.secure_url;
        }

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            status,
            whatWillYouLearn,
            tag,
            category: categoryDetails._id,
            thumbnail: thumbnailUrl,
            instructions
        });

        await User.findByIdAndUpdate(userId, {
            $push: {
                courses: newCourse._id
            }
        });

        await Category.findByIdAndUpdate(category, {
                $push: {
                    courses: newCourse._id
                }
            });

        return res.status(201).json({
            success: true,
            data: newCourse,
            message: "Course created successfully"
        })
    }
    catch(e){
        console.error(e)
        res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: e.message
        })
    }

}

async function editCourse(req, res){

    try{
        const parseResult = editCourseValidator.safeParse(req.body);

        if(!parseResult.success){
            return res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: parseResult.error.errors
            })
        }

        const { courseId, ...updates } = parseResult.data;

        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }

        if(req.files?.thumbnailImage){
            const thumbnail = req.files.thumbnailImage;
            const uploadedImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = uploadedImage.secure._url;
        }

    for (const key in updates) {
        if (Object.prototype.hasOwnProperty.call(updates, key)) {
            course[key] = key === "tag" || key === "instructions" ? parseJsonIfString(updates[key]) : updates[key];
        }
    }

        await course.save();

        const updatedCourse = await Course.findById(courseId)
        .populate("instructor")
        .populate("category")
        .populate("ratingAndReview")
        .populate({ path: "courseContent", populate: "subSection" });

        return res.json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Interval server error",
            error: e.message
        })
    }
}

async function getAllCourses(req, res){
    try{
        const allCourses = await Course.find({
            status: "Published"
        }).select("courseName, price, thumbnail instructor ratingAndReview studentsEnrolled")
        .populate("instructor");

        return res.status(200).json({
            success: true,
            data: allCourses
        });
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
            error: e.message
        })
    }
}

async function getCourseDetails(req, res){
    try{
        const { courseId } = req.body;
        const courseDetails = await Course.findById(courseId)
        .populate("instructor")
        .populate("category")
        .populate("ratingAndReview")
        .populate({ path: "courseContent", populate: { path: "subSection", select: "-videoUrl" }})

        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`
            })
        }

        let totalDurationInSeconds = 0;

        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((sub) => {
                totalDurationInSeconds += parseInt(sub.timeDuration)
            });
        });

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration
            }
        })
    } 
    catch(e){
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

async function getFullCourseDetails(req, res) {

    try{
        const { courseId } = req.body;
        const userId = req.user.id;
        const courseDetails = await Course.findById(courseId)
        .populate("instructor")
        .populate("category")
        .populate("ratingAndReview").
        populate({
            path: "courseContent",
            populate: "subSection"
        });

        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: `Could not find course with id: ${courseId}`
            })
        }

        let courseProgress = await CourseProgress.findOne({ courseId, userId });


        let totalDurationInSeconds = 0;

        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((sub) => {
                totalDurationInSeconds += parseInt(sub.timeDuration);
            })
        });

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgress?.completedVideos || []
            }
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

async function getInstructorCourses(req, res) {
    try{
        const instructorId = req.user.id;

        const instructorCourses = await Course.find({
            instructor: instructorId,
        })
        .sort({ createdAt: -1})
        .populate("category");

        return res.status(200).json({
            success: true,
            data: instructorCourses
        })
    }
    catch(e){
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: e.message
        })
    }
}

async function deleteCourse(req, res){

    try{
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }
        
        for(const studentId of course.studentsEnrolled){
            await User.findByIdAndUpdate(studentId, {
                $pull: {
                    courses: courseId
                }
            })
        }

        const courseSections = course.courseContent;

        for(const sectionId of courseSections){
            const section = await Section.findById(sectionId)
            if(section){
                for(const subSectionId of section.subSection){
                    await SubSection.findByIdAndDelete(subSectionId)
                }
            }

            await Section.findByIdAndDelete(sectionId);
        }

        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: e.message
        })
    }
}


export {
    createCourse,
    editCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    getInstructorCourses,
    deleteCourse
}