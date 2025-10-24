import { z } from "zod";
import { User } from "../models/Users.js";
import { Profile } from "../models/Profile.js";
import { Course } from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { uploadImageToCloudinary } from "../utils/ImageUploader.js";
import { convertSecondsToDuration } from "../utils/secToDuration.js";
import mongoose from "mongoose";


const updateProfileValidator = z.object({
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    dateOfBirth: z.string().optional(),
    about: z.string().optional(),
    contactNumber: z.string().regex(/^[0-9]{10}$/, "Contact number must be of 10 digits").optional(),
    gender: z.enum(["Male", "Female", "Non-Binary", "Prefer not to say", "other"]).optional()
})

async function updateProfile(req, res){

    try{
        const parsedResult = updateProfileValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                message: "Invalid input",
                errors: parsedResult.error.errors
            })
        }

        const { firstName, lastName, dateOfBirth, contactNumber, about, gender } = parsedResult.data;

        const userId = req.user.userId;
        
        const userDetails = await User.findById(userId);

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        const profile = await Profile.findById(userDetails.additionalDetails)

        if(!profile){
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            })
        }

        const user = await User.findByIdAndUpdate(userId, {
            firstName,
            lastName
        })

        await user.save();

        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.contactNumber = contactNumber;
        profile.gender = gender;

        await profile.save();

        const updatedUserDetails = await User.findById(userId).populate("additionalDetails").exec();

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

async function updateDisplayPicture(req, res){
    try{

        const displayPicture = req.files.displayPicture;

        const userId = req.user.userId;

        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )

        console.log("Image:", image);

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
    } catch(e){
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

const deleteAccountValidator = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user id format")
});

async function deleteAccount(req, res){
    try{
        const userId = req.user.userId;

        const parsedResult = deleteAccountValidator.safeParse({ id: userId })

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
                errors: parsedResult.error.errors
            })
        }

        const user = await User.findById({ _id: userId });

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        await Profile.findByIdAndDelete({
            _id: new mongoose.SchemaTypeOptions.ObjectId(user.additionalDetails)
        });

            for(const courseId of user.courses){
            await Course.findByIdAndUpdate(
                courseId,
                {
                    $pull: {
                        studentsEnroled: userId
                    }
                }, 
                {
                    new: true
                }
            )
        }

        await User.findByIdAndDelete({ _id: userId });
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

        await CourseProgress.deleteMany({
            userId: userId
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

        const userId = req.user.userId;

        const userDetails = await User.findById(userId).populate("additionalDetails").exec();
        console.log("User details:", userDetails)

        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
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


async function getEnrolledCourses(req, res){
    try{

        const userId = req.user.userId;

        let userDetails = await User.findOne({ _id: userId }).populate({
            path: "courses",
            populate: {
                path: "courseContent",
                populate:{
                    path: "subSection"
                }
            }
        }).exec();

        userDetails = userDetails.toObject();
        let SubSectionLength = 0;
        for(let i = 0; i < userDetails.courses.length; i++){
            let totalDurationInSeconds = 0 ;
            SubSectionLength = 0;

            for(let j = 0; j < userDetails.courses[i].courseContent.length; j++){
                totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds)
                SubSectionLength += userDetails.courses[i].courseContent[j].subSection.length;
                userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);
            }

            let courseProgressCount = await CourseProgress.findOne({
                courseId: userDetails.courses[i]._id,
                userId: userId
            });

            courseProgressCount = courseProgressCount?.completedVideos.length;

            if(SubSectionLength === 0){
                userDetails.courses[i].progressPercentage = 100;
            } else{
                const multiplier = Math.pow(10, 2)
                userDetails.courses[i].progressPercentage = Math.round((courseProgressCount / SubSectionLength) * 100 * multiplier) / multiplier
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

async function instructorDashboard(req, res) {
    try{

        const instructorId = req.user.userId;
        const courseDetails = await Course.find({
            instructor: instructorId
        })

        const courseData = courseDetails.map((course) => {

                const totalStudentsEnrolled = course.studentsEnroled.length;
                const totalAmountGenerated = totalStudentsEnrolled * course.price

                const courseDetailsWithStats = {
                    _id: course._id,
                    courseName: course.courseName,
                    courseDescription: course.courseDescription,
                    totalStudentsEnrolled,
                    totalAmountGenerated
                }

                return courseDetailsWithStats
        })

        return res.status(200).json({
            courses: courseData
        })
    } catch(e){
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