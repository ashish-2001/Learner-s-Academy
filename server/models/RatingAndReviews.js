import mongoose from "mongoose";

const ratingAndReviewSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        index: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    review: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

ratingAndReviewSchema.index({ user: 1, course: 1}, { unique: true});

const RatingAndReview = mongoose.model("RatingAndReview", ratingAndReviewSchema);

export {
    RatingAndReview
};