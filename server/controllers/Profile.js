import { z } from "zod";
import { User } from "../models/Users.js";
import { Profile } from "../models/Profile.js";
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

        const userId = req.user.userId
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

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if(user.additionalDetails){
            await Profile.findByIdAndDelete(user.additionalDetails)
        }
        
        if(user.courses.length > 0){
            for(const courseId of user.courses){
            await Course.findByIdAndUpdate(
                courseId,
                {
                    $pull: {
                        studentsEnrolled: userId
                    }
                }, 
                {
                    new: true
                }
            )
        }
        }

        await CourseProgress.deleteMany({
            userId
        })

        await User.findByIdAndDelete(userId);

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

const userValidator = z.object({
    userId: z.string().min(1, "User id is required")
});

async function getAllUserDetails(req, res){
    try{

        const userId = req.user.userId
        const parsedResult = userValidator.safeParse({ userId });

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                message: "Invalid user data",
                errors: parsedResult.error.errors.map(err => err.message)
            })
        }

        const userDetails = await User.findById(userId).populate("additionalDetails").exec();

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            })
        }
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


async function updateDisplayPicture(req, res){
    try{

        const userId = req.user.userId;

        if(!req.files || !req.files.displayPicture){
            return res.status(400).json({
                success: false,
                message: "No display picture file provided"
            })
        }

        const displayPicture = req.files.displayPicture;

        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            100,
            1000
        )

        const updatedUser = await User.findByIdAndUpdate({
            userId
        }, {
            image: image.secure_url
        }, {
            new: true,
            select: "-password"
        })

        if(!updatedUser){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Image updated successfully",
            data: updatedUser
        })
    } catch(e){
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

const enrolledCoursesValidator = z.object({
    userId: z.string().min(1, "Courses id is required")
})

async function getEnrolledCourses(req, res){
    try{
        const parsedResult = enrolledCoursesValidator.safeParse({userId:req.user.userId});

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
                errors: parsedResult.error.errors
            })
        }

        const userId = parsedResult.data.userId;

        let userDetails = await User.findById(userId).populate({
            path: "courses",
            populate: {
                path: "courseContent",
                populate:{
                    path: "subSection"
                }
            }
        }).exec();

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: `User not found`
            })
        }

        userDetails = userDetails.toObject();
    

        for(let i = 0; i < userDetails.courses.length; i++){
            let totalDurationInSeconds = 0 ;
            let subSectionLength = 0;

            for(let j = 0; j < userDetails.courses[i].courseContent.length; j++){
                const subSections = userDetails.courses[i].courseContent[j].subSection || [];
                totalDurationInSeconds += subSections.reduce(
                    (acc, curr) => acc + Number(curr.timeDuration || 0 ),
                    0
                );
                
                subSectionLength += subSections.length;
            }

            userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);

            const courseProgress = await CourseProgress.findOne({
                courseId: userDetails.courses[i]._id,
                userId: userId
            });

            const completedVideos = courseProgress?.completedVideos?.length || 0;

            userDetails.courses[i].progressPercentage = subSectionLength === 0 ? 100 : Math.round((completedVideos / subSectionLength) * 100 * 100) / 100;

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
    userId: z.string().min(1, "Instructor id is required")
})


async function instructorDashboard(req, res) {
    try{
        const parsedResult = instructorDashboardValidator.safeParse({ userId: req.user.userId });

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                message: "Instructor id is required",
                errors: parsedResult.error.errors
            })
        }

        const instructorId = parsedResult.data.userId;

        const courseDetails = await Course.find({
            instructor: instructorId
        })

        const courseData = courseDetails.map((course) => {
            return {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled: course.studentsEnrolled.length,
                totalAmountGenerated: course.studentsEnrolled.length * (course.price || 0)
            }
        })

        return res.status(200).json({
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