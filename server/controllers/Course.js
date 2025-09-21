import { z } from "zod";
import { User } from "../models/Users";
import { Category } from "../models/Category";
import { Course } from "../models/Course";
import { Section } from "../models/Section";
import { SubSection } from "../models/SubSection";
import { convertSecondsToDuration } from "../utils/secToDuration";
import { uploadImageToCloudinary } from "../utils/ImageUploader";

const courseValidator = z.object({
    courseName: z.string().min(1, "Course name is required"),
    courseDescription: z.string().min(1, "Course description is required"),
    whatWillYouLearn: z.string().min(1, "Learning point is required"),
    price: z.number().positive("Price must be greater than 0"),
    tag: z.array(z.string()).nonempty( "At least one tag is required"),
    category: z.string().min(1, "Category is required"),
    status: z.string().optional(),
    instructions: z.array(z.string()).nonempty("Instruction is required")
    
})
const createCourse = async (req, res) =>{

    const userIds = req.user.userId;

    try{
        const result = courseValidator.safeParse(req.body);

        if(!result.success){
            return res.status(403).json({
                message: "Incorrect input",
                success: false
            })
        }

        const {
            courseName, 
            courseDescription,
            whatWillYouLearn,
            price,
            tag: _tag,
            category,
            status,
            instructions: _instructions
        } = result.data;

        const thumbnail = req.files.thumbnailImage;

        const tag = JSON.parse(_tag);
        const instructions = JSON.parse(_instructions);

        if( !courseName || !courseDescription || !whatWillYouLearn || !price || !tag || !category || !instructions ){
            return res.status(403).json({
                message: "All fields are required",
                success: false
            })
        }

        if(!status || status === undefined){
            status === "Draft"
        }

        const instructorDetails = await User.findById(userIds, {
            accountType: "Instructor"
        })

        if(!instructorDetails){
            return res.status(403).json({
                message: "Instructor details not found!",
                success: false
            })
        }

        const categoryDetails = await Category.findById(category);

        if(!categoryDetails){
            return res.status(403).json({
                message: "Category details not found"
            })
        }

        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
        )

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            status,
            whatWillYouLearn,
            tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_id,
            instructions
        });

        await User.findByIdAndUpdate({
            _id: instructorDetails._id
        },
        {
            $push: {
                courses: newCourse._id
            }
        }, {
            new: true
        })

        await Category.findByIdAndUpdate(
            {
                _id: category
            }, {
                $push: {
                    courses: newCourse._id
                }
            }, {
                new: true
            }
        )

        res.status(200).json({
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
})

async function editCourse(req, res){

    try{
        const parseResult = editCourseValidator.safeParse(req.body);

        if(!parseResult.success){
            return res.status(403).json({
                success: false,
                message: "Invalid input",
                errors: parseResult.error.errors
            })
        }

        const validatedData = parseResult.data;

        const { courseId, ...updates } = validatedData;

        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                error: "Course not found"
            });
        }

        if(req.files?.thumbnailImage){
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure._url;
        }

    for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
            if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
            } else {
            course[key] = updates[key]
            }
        }
    }

        await course.save();

        const updatedCourse = await Course.findOne({
            _id: courseId
        }).populate({
            path: "instructor",
            populate: {
                path: "additionalDetails"
            }
        }).populate("category").populate("ratingAndReviews").populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec()

        res.json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse
        })
    }
    catch(e){
        res.status(500).json({
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
        }, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReview: true,
            studentsEnrolled: true
        }).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            data: allCourses
        })
    }
    catch(e){
        return res.status(404).json({
            success: false,
            message: "Can,t fetch course data",
            error: e.message
        })
    }
}

async function getCourseDetails(req, res){
    try{
        const { courseId} = req.body;
        const courseDetails = await Course.findOne({
            _id: courseId,
        }).populate({
            path: "instructor",
            populate: {
                path: "additionalDetails"
            }
        }).populate("category").populate("ratingAndReview").populate({
            path: "courseContent",
            populate: {
                path: "subSection",
                select: "-videoUrl"
            }
        }).exec();

        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`
            })
        }

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds;
            })
        })

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
            success: true,
            message: e.message
        })
    }
}

async function getFullCourseDetails(req, res) {

    try{
        const { courseId } = req.body;
        const userId = req.user.id;
        const courseDetails = await Course.findOne({
            _id: courseId
        }).populate({
            path: "instructor",
            populate: {
                path: "additionalDetails"
            }
        }).populate("category").populate("ratingAndReview").populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec();

        let courseProgressCount = await courseProgressCount.findOne({
            courseId: courseId,
            userId: userId
        })

        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`
            })
        }

        let totalDurationInSeconds = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration);
                totalDurationInSeconds += timeDurationInSeconds;
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos
                ? courseProgressCount?.completedVideos
                : []
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
        }).sort({ createdAt: -1})

        res.status(200).json({
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
                    course: courseId
                }
            })
        }

        const courseSections = course.courseContent;
        for(const sectionId of courseSections){
            const section = await Section.findById(sectionId)
            if(section){
                const subSections = section.subSection
                for(const subSectionId of subSections){
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