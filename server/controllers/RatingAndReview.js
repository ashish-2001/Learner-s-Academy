import { z } from "zod";
import mongoose from "mongoose";
import { Course } from "../models/Course.js";
import { RatingAndReview } from "../models/RatingAndReviews.js";

const createRatingValidator = z.object({
    rating: z.number({
        required_error: "Rating is required",
        invalid_type_error: "Rating must be a number"
    }).min(1, "Rating must be at least 1").max(5, "Rating can not be more than 5"),
    review: z.string().min(1, "Review can not be empty"),
    courseId: z.string().min(1, "Course id is required")
})

async function createRating(req, res){

    try{
        const { rating , review, courseId } = createRatingValidator.safeParse(req.body);
        const userId = req.user.id;

        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: {
                $elemMatch: {
                    $eq: userId
                }
            }
        })

        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in this course"
            })
        }

        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        })

        if(alreadyReviewed){
            return res.status(403).json({
                success: false,
                message: "Course already reviewed by user"
            })
        }

        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId
        })

        await Course.findByIdAndUpdate(courseId, {
            $push: {
                ratingAndReview: ratingReview
            }
        })

        await courseDetails.save();

        return res.status(201).json({
            success: true,
            message: "Rating and review created successfully",
            ratingReview
        })
    }
    catch(e){
        if(e instanceof z.ZodError){
            return res.status(400).json({
                success: false,
                errors: e.errors.map((e) => e.message) 
            })
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: e.message
        })
    }
}

const getAllAverageRatingValidator = z.object({
    courseId:  z.string().min(1, "Course id is required").refine((val)=> mongoose.Types.Objectid.isValid(val))
})

async function getAverageRating(req, res){

    try{
        const { courseId } = getAllAverageRatingValidator.safeParse(req.body);

        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId)
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: "$rating"
                    }
                }
            }
        ])

        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating
            })
        }

        return res.status(200).json({
            success: true,
            averageRating: 0
        })
    }
    catch(e){
        if(e instanceof z.ZodError){
            return res.status(400).json({
                success: false,
                errors: e.errors.map((err) => err.message)
            })
        }

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve the rating for the course",
            error: e.message
        })
    }
}

async function getAllRating(req, res){
    try{
        const allReviews = await RatingAndReview.find({}).sort({rating: "desc"}).populate({
            path: "user",
            select: "FirstName lastName email image"
        }).populate({
            path: "course",
            select: "courseName"
        }).exec();

        return res.status(200).json({
            success: true,
            data: allReviews
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve the rating and review for the course",
            error: e.message
        })
    }
}



export {
    createRating,
    getAverageRating,
    getAllRating
}