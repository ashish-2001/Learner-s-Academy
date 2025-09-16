import mongoose from "mongoose";

const ratingAndReviewSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.types.ObjectId,
        ref: "User",
        required: true
    },

    course: {
        type: mongoose.Schema.types.ObjectId,
        ref: "Course",
        required: true
    },

    rating: {
        type: Number,
        required: true
    },

    review: {
        type: String,
        required: true
    }
})

const RatingAndReview = mongoose.model("RatingAndReview", ratingAndReviewSchema);

export {
    RatingAndReview
}