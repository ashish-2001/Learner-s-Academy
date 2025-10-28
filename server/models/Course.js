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

    thumbnailImage: {
        type: String
    },

    tag: {
        type: [String],
        required: true
    },

    instructions: {
        type: [String]
    },

    status: {
        type: String,
        enum: ["Draft", "Published"],
        default: "Draft"
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

    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }],

    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReviews"
    }],

    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
    }],

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
}, {
    timestamps: true
});

const Course = mongoose.model("Course", courseSchema);

export {
    Course
}