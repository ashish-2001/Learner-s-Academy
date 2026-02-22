import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    
    courseName: {
        type: String
    },

    courseDescription: {
        type: String
    },

    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    whatWillYouLearn: {
        type: String,
        required: true
    },

    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
    }],

    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview"
    }],

    price: {
        type: Number
    },

    thumbnailImage: {
        type: String
    },

    tag: {
        type: [String],
        default: []
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }],

    instructions: {
        type: [String],
        default: []
    },

    status: {
        type: String,
        enum: ["Draft", "Published"],
        default: "Draft"
    }
}, {
    timestamps: true
});

const Course = mongoose.model("Course", courseSchema);

export {
    Course
};