import { z } from "zod";
import { User } from "../models/Users.js";
import { Profile } from "../models/Profile.js";
import { Course } from "../models/Course.js";
import { uploadImageToCloudinary } from "../utils/ImageUploader.js";

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
                message: "All fields are required",
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

        const updatedProfile = await User.findByIdAndUpdate(
            userId
        , {
            image: image.secure_url
        }, {
            new: true
        });

        if(!updatedProfile){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if(!displayPicture){
            return res.status(404).json({
                success: false,
                message: "Image not found"
            })
        }

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
        };

        await Profile.findByIdAndDelete({
            _id: user.additionalDetails
        });

        await User.findByIdAndDelete({ _id: userId})

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch(e){
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
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const enrolledCourses = await User.findById(userId).populate({
            path: "courses",
            populate: {
                path: "courseContent"
            }
        }).populate("courseProgress").exec();

        res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            data: enrolledCourses
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

async function instructorDashboard(req, res) {
    try{

        const userId = req.user.userId;
        const courseData = await Course.find({
            instructor: userId
        })

        const courseDetails = courseData.map((course) => {

                const totalStudents = course.studentsEnrolled.length;
                const totalRevenue = course?.price * totalStudents;

                const courseStats = {
                    _id: course._id,
                    courseName: course.courseName,
                    courseDescription: course.courseDescription,
                    totalStudents,
                    totalRevenue
                }

                return courseStats
        })

        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            data: courseDetails
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