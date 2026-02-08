import { z } from "zod";
import mongoose from "mongoose";
import { Course } from "../models/Course.js";
import { RatingAndReview } from "../models/RatingAndReviews.js";

const createRatingValidator = z.object({
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating can not be more than 5"),
    review: z.string().min(1, "Review can not be empty"),
    courseId: z.string().min(1, "Course id is required")
})

async function createRating(req, res){

    try{
        const parsed = createRatingValidator.safeParse(req.body);
        const userId = req.user.userId;

        if(!parsed.success){
            return res.status(400).json({
                success: false,
                message: "Validation failed",
            })
        }

        const { rating, review, courseId } = parsed.data;

        const courseDetails = await Course.find({
            _id: courseId,
            studentsEnrolled: {
                $elemMatch: {
                    $eq: userId
                }
            }
        });

        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in this course"
            })
        }

        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        });

        if(alreadyReviewed){
            return res.status(404).json({
                success: false,
                message: "Course already reviewed by user"
            })
        };

        const ratingAndReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId
        });

        await Course.findByIdAndUpdate({
            _id: courseId,
                $push: {
                    ratingAndReviews: ratingAndReview._id
                }
        });

        return res.status(200).json({
            success: true,
            message: "Rating added successfully",
            data: ratingAndReview
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: e.message
        });
    };
};

async function getAverageRating(req, res){

    try{

        const { courseId } = req.body.courseId;

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
        ]);

        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating
            })
        }
        else{
            return res.status(200).json({
                success: true,
                averageRating: 0
            });
        }
    }
    catch(e){
        return res.status(500).json({
            success: false,
            errors: e.message
        })
    }
}

async function getAllRating(req, res){
    try{

        const allReviews = await RatingAndReview.find().sort({ rating: -1 }).populate({
            path: "user",
            select: "firstName lastName email image"
        }).populate({
            path: "course",
            select: "courseName"
        }).exec();

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
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