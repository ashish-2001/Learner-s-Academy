import { User } from "../models/Users.js";
import { Category } from "../models/Category.js";
import { Course } from "../models/Course.js";
import { Section } from "../models/Section.js";
import { SubSection } from "../models/SubSection.js";
import { convertSecondsToDuration } from "../utils/secToDuration.js";
import { uploadImageToCloudinary } from "../utils/ImageUploader.js";
import { CourseProgress } from "../models/CourseProgress.js";

async function createCourse(req, res){

    const userId = req.user.userId;

    try{
        
        let {
            courseName, 
            courseDescription,
            whatWillYouLearn,
            price,
            tag,
            category,
            status,
            instructions
        } = req.body;

        if (!req.files || !req.files.thumbnailImage) {
            return res.status(400).json({
                success: false,
                message: "Thumbnail image is missing. Please upload a file."
            });
        }

        const thumbnail = req.files.thumbnailImage;

        if(
            !courseName || 
            !courseDescription || 
            !whatWillYouLearn || 
            !price || 
            !tag ||
            !thumbnail || 
            !category
        ){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        };

        const instructorDetails = await User.findById(userId)

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor details not found!"
            })
        }

        const categoryDetails = await Category.findById(category);

        if(!categoryDetails){
            return res.status(404).json({
                success: false,
                message: "Category details not found"
            });
        }

        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME || "default"
        );

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatWillYouLearn,
            price,
            tag: JSON.parse(tag),
            category: categoryDetails._id,
            thumbnailImage: thumbnailImage.secure_url,
            status: status || "Draft",
            instructions: JSON.parse(instructions)
        });

        await User.findByIdAndUpdate( instructorDetails._id,
            {
                $push: {
                    courses: newCourse._id
                }
            },
            {
                new: true
            }
        );

        await Category.findByIdAndUpdate( category,
            {
                $push: {
                    course: newCourse._id
                },
            },
            {
                new: true
            }
        )

        return res.status(200).json({
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

async function getAllCourses(req, res){

    try{
        const allCourses = await Course.find(
            {},
            {
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentsEnrolled: true
        }).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            data: allCourses
        });
    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
            error: e.message
        })
    }
}

async function getCourseDetails(req, res){
    try{
        
        const { courseId } = req.query;

        if(!courseId){
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            })
        }

        const courseDetails = await Course.findById(courseId)
        .populate({
            path:"instructor",
            populate: {
                path: "additionalDetails",
            }
        })
        .populate("category")
        .populate({
            path:"ratingAndReviews",
            populate: {
                path: "user",
                select: "firstName lastName accountType image"
            }
        })
        .populate({ 
            path: "courseContent", 
            populate: { 
                path: "subSection", 
        }}).exec();

        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: `Could not found`
            });
        };

        return res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            data: courseDetails
        });
    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Can not fetch course data",
            error: e.message
        })
    }
}


async function getInstructorCourses(req, res) {

    try{
        const userId = req.user.userId;

        const allCourses = await Course.find({
            instructor: userId,
        });

        return res.status(200).json({
            success: true,
            data: allCourses
        })
    }
    catch(e){
        res.status(500).json({
            success: false,
            message: "Failed to fetch instructor courses",
            error: e.message
        })
    }
}

async function editCourse(req, res){

    try{
        const {
            courseId,
            courseName,
            courseDescription,
            whatWillYouLearn,
            price,
            tag,
            category,
            status,
            instructions,
        } = req.body;

        if(!courseId){
            return res.status(400).json({
                success: false,
                message: "Course not found!"
            });
        };

        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }
        
        let parsedTags = course.tag;

        if(tag){
            try{
                parsedTags = typeof tag === "string" ? JSON.parse(tag) : tag;
            } catch {
                parsedTags = [tag];
            }
        }

        let parsedInstructions = course.instructions;

        if(instructions){
            try{
                parsedInstructions = typeof instructions === "string" ? JSON.parse(instructions) : instructions
            } catch {
                parsedInstructions = [instructions]
            }
        }

        if(category){
            const categoryId = typeof category === "object" ? category._id: category;
            const categoryExists = await Category.findById(categoryId);
            if(!categoryExists){
                return res.status(404).json({
                    success: false,
                    message: "Category not found"
                });
            }
            course.category = categoryId;
        }

        if(req.files && req.files.thumbnailImage){
            console.log("Thumbnail update");
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME || "default"
            )
            course.thumbnailImage = thumbnailImage.secure_url;
        }

        if(courseName) {
            course.courseName = courseName;
        }
        if(courseDescription){
            course.courseDescription = courseDescription;
        }
        if(whatWillYouLearn){
            course.whatWillYouLearn = whatWillYouLearn;
        }
        if(price){
            course.price = price;
        }
        if(status){
            course.status = status;
        }
        if(parsedTags){
            course.tag = parsedTags;
        }
        if(parsedInstructions){
            course.instructions = parsedInstructions;
        }

        await course.save();

    const updatedCourse = await Course.findOne({ _id: courseId })
        .populate({
            path:"instructor",
            populate: {
                path: "additionalDetails"
            }
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({ 
            path: "courseContent",
            populate: {
                path: "subSection" 
            }
        }).exec();

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse
        })
    }
    catch(e){
        console.error("Edit course error:", e)
        return res.status(500).json({
            success: false,
            message: "Interval server error",
            error: e.message
        })
    }
}


async function getFullCourseDetails(req, res) {

    try{
        const { courseId } = req.query;
        const userId = req.user.userId;
        const courseDetails = await Course.findOne({ _id: courseId })
        .populate({
            path: "instructor",
            populate: {
                path: "additionalDetails"
            }
        })
        .populate("category")
        .populate("ratingAndReviews").
        populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec();

        let courseProgressCount = await CourseProgress.findOne({
            courseId: courseId,
            userId: userId
        });

        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`
            })
        }

        if(courseDetails.status === "Draft" && courseDetails.instructor._id.toString() !== req.user.userId){
            if(courseDetails.status === "Draft"){
                return res.status(403).json({
                    success: false,
                    message: "Accessing a draft course is forbidden"
                });
            };
        }

        let totalDurationInSeconds = 0;

        courseDetails.courseContent.forEach((content) => {
                content.subSection.forEach((subSection) => {
                const timeDurationSeconds = parseInt(subSection.timeDuration);
                totalDurationInSeconds += timeDurationSeconds
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
                : ["none"]
            }
        });
    } catch(e){
        return res.status(500).json({
            success: false,
            message: e.message
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
        
        const studentsEnrolled = course.studentsEnrolled;
        for(const studentId of studentsEnrolled){
            await User.findByIdAndUpdate(studentId, {
                $pull: {
                    courses: courseId
                }
            })
        }

        const courseSections = course.courseContent;

        for(const sectionId of courseSections){
            const section = await Section.findById(sectionId);
            if(section){
                const subSections = section.subSection;
                for(const subSectionId of subSections){
                    await SubSection.findByIdAndDelete(subSectionId)
                }
            }

            await Section.findByIdAndDelete(sectionId);
        }

        await Course.findByIdAndDelete(courseId);
        await Category.findByIdAndUpdate(course.category._id, {
            $pull: {
                courses: courseId
            }
        });

        await User.findByIdAndUpdate(course.instructor._id, {
            $pull: {
                courses: courseId
            }
        });

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: e.message
        })
    }
}

async function searchCourse(req, res){

    try{

        const { searchQuery } = req.body;

        if(!searchQuery || searchQuery.trim() === ""){
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const courses = await Course.find({
            $or: [
                {
                    courseName: {
                        $regex: searchQuery,
                        $options: "i"
                    }
                },
                {
                    courseDescription: {
                        $regex: searchQuery,
                        $options: "i"
                    }
                },
                {
                    tag: {
                        $regex: searchQuery,
                        $options: "i"
                    }
                }
            ]
        }).populate("instructor")
        .populate("category")
        .populate("ratingAndReviews")
        .exec();

        return res.status(200).json({
            success: true,
            data: courses
        });
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

async function markLectureAsComplete(req, res){

    const { courseId, subSectionId, userId } = req.body;

    if(!courseId || !subSectionId || !userId){
        return res.status(400).json({
            success: false,
            message: "All the fields are required"
        })
    };
    
    try{
        const progressAlreadyExists = await CourseProgress.findOne({
            userId: userId,
            courseId: courseId
        });

        const completedVideos = progressAlreadyExists.completedVideos;

        if(!completedVideos.includes(subSectionId)){
            await CourseProgress.findOneAndUpdate(
                {
                    userId: userId,
                    courseId: courseId
                },
                {
                    $push: {
                        completedVideos: subSectionId
                    }
                }
            )
        } else{
            return res.status(400).json({
                success: false,
                message: "Lecture already marked as complete"
            });
        }

        await CourseProgress.findOneAndUpdate(
            {
                userId: userId,
                courseId: courseId
            },
            {
                completedVideos: completedVideos
            }
        )

        return res.status(200).json({
            success: true,
            message: "Lecture marked as complete"
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};


export {
    createCourse,
    editCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    getInstructorCourses,
    deleteCourse,
    searchCourse,
    markLectureAsComplete
};