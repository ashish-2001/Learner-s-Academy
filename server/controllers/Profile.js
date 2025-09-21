import { z } from "zod";
import mongoose from "mongoose";
import { User } from "../models/Users.js";
import { Profile } from "../models/profile.js";
import { Course } from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { uploadImageToCloudinary } from "../utils/ImageUploader.js";
import { convertSecondsToDuration } from "../utils/secToDuration.js";

const updateProfileValidator = z.object({
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    dateOfBirth: z.string().optional(),
    about: z.string().optional(),
    contactNumber: z.string().regex(/^[0-9]{10}$/, "Contact number must be of 10 digits").optional(),
    gender: z.enum(["male", "female", "other"]).optional()
})

async function updateProfile(req, res){

    try{
        const parsedResult = updateProfileValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(400).json({
                success: true,
                message: "Invalid input",
                errors: parsedResult.error.errors
            })
        }

        const { firstName, lastName, dateOfBirth, contactNumber, about, gender } = parsedResult.data;

        const id = req.user.id
        const userDetails = await User.findById(id);

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        const profile = await Profile.findById(userDetails.additionalDetails)

        if(profile){
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            })
        }

        if(firstName !== undefined){
            userDetails.firstName = firstName
        }

        if(lastName !== undefined){
            userDetails.lastName = lastName;
        }

        await userDetails.save();

        if(dateOfBirth !== undefined){
            profile.dateOfBirth = dateOfBirth;
        }

        if(about !== undefined){
            profile.about = about
        }

        if(contactNumber !== undefined){
            profile.contactNumber = contactNumber
        }

        if(gender !== undefined){
            profile.gender = gender
        }

        await profile.save();

        const updatedUserDetails = await User.findById(id).populate("additionalDetails").exec();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            updatedUserDetails
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: e.message
        })
    }
}

const deleteAccountValidator = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user id format")
});

async function deleteAccount(req, res){
    try{
        const id = req.user.id;

        const parsedResult = deleteAccountValidator.safeParse({id})

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
                errors: parsedResult.error.errors
            })
        }

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        await Profile.findByIdAndDelete({
            _id: new mongoose.types.ObjectId(user.additionalDetails)
        })

        for(const courseId of user.courses){
            await Course.findByIdAndUpdate(
                courseId,
                {
                    $pull: {
                        studentsEnrolled: id
                    }
                }, 
                {
                    new: true
                }
            )
        }

        await User.findByIdAndDelete(id);

        await CourseProgress.deleteMany({
            userid: id
        })

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "User cannot be deleted",
            error: e.message
        })
    }
}

async function getAllUserDetails(req, res){
    try{
        const id = req.user.id;
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        return res.status(200).json({
            success: true,
            message: "user data fetched successfully",
            data: userDetails
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

const updateDisplayPictureValidator = z.object({
    id: z.string().min(1, "User id is required")
})

async function updateDisplayPicture(req, res){
    try{

        const parsedResult = updateDisplayPictureValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(404).json({
                success: false,
                message: "User not found",
                errors: parsedResult.error.errors
            })
        }

        const { userId } = parsedResult.data;
        const displayPicture = req.files.displayPicture;

        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            100,
            1000
        )

        const updatedProfile = await User.findByIdAndUpdate({
            _id: userId
        }, {
            image: image.secure_url
        }, {
            new: true
        })

        return res.status(200).json({
            success: true,
            message: "Image updated successfully",
            data: updatedProfile
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

const enrolledCoursesValidator = z.object({
    id: z.string().min(1, "Courses id is required")
})

async function getEnrolledCourses(req, res){
    try{
        const parsedResult = enrolledCoursesValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(404).json({
                success: false,
                message: "Course id is required",
                errors: parsedResult.error.errors
            })
        }

        const { userId } = parsedResult.data;

        let userDetails = await User.findOne({
            _id: userId
        }).populate({
            path: "courses",
            populate: {
                path: "courseContent",
                populate:{
                    path: "subSection"
                }
            }
        }).exec();

        userDetails = userDetails.toObject();
        let SubsectionLength = 0;

        for(let i =0; i < userDetails.courses.length; i++){
            let totalDurationInSeconds = 0 ;
            SubsectionLength = 0;
            for(let j = 0; j < userDetails.courses[i].courseContent.length; j++){
                totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds)
                SubsectionLength += userDetails.courses[i].courseContent[j].subSection.length
            }

            let courseProgressCount = await CourseProgress.findOne({
                courseId: userDetails.courses[i]._id,
                userId: userId
            })

            courseProgressCount = courseProgressCount?.completedVideos.length
            if(SubsectionLength === 0){
                userDetails.courses[i].progressPercentage = 100;
            }
            else{
                const multiplier = Math.pow(10, 2);
                userDetails.courses[i].progressPercentage = Math.round((courseProgressCount / SubsectionLength) * 100 * multiplier) / multiplier
            }
        }

        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`
            })
        }

        return res.status(200).json({
            success: true,
            data: userDetails.courses
        })
    }catch(e){
        return res.status(500).json({
            success: false,
            message: e.message 
        })
    }
}

const instructorDashboardValidator = z.object({
    id: z.string().min(1, "Instructor id is required")
})


async function instructorDashboard(req, res) {
    try{
        const parsedResult = instructorDashboardValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                message: "Instructor id is required",
                errors: parsedResult.error.errors
            })
        }

        const instructorId = req.user.id;

        const courseDetails = await Course.find({
            instructor: instructorId
        })

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length;
            const totalAmountGenerated = totalStudentsEnrolled * course.price;

            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,

                totalStudentsEnrolled,
                totalAmountGenerated
            }

            return courseDataWithStats
        })

        res.status(200).json({
            courses: courseData
        })
    }
    catch(e){
        res.status(500).json({
            message: "Internal server error",
            error: e.message
        })
    }
}


export {
    updateProfile,
    deleteAccount,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
    instructorDashboard
}