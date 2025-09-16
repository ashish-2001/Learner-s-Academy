import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },

    courseDescription: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    thumbnail: {
        type: String,
        required: true
    },

    tag: {
        type: [String]
    },

    instructions: {
        type: [String]
    },

    status: {
        type: String,
        enum: ["Draft, Published"]
    },

    instructor: {
        type: mongoose.Schema.types.ObjectId,
        required: true,
        ref: "User"
    },

    whatWillYouLearn: {
        type: String,
        required: true
    },

    studentsEnrolled: {
        type: mongoose.Schema.types.ObjectId,
        required: true,
        ref: "User"
    },

    ratingAndReviews: {
        type: mongoose.Schema.types.ObjectId,
        ref: "RatingAndReviews"
    },

    courseContent: {
        type: mongoose.Schema.types.ObjectId,
        ref: "Section"
    },

    categoryName: {
        type: mongoose.Schema.types.ObjectId,
        ref: "Category"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Course = mongoose.model("Course", courseSchema);

export {
    Course
}