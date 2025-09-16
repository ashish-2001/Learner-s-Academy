import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({

    courseId: {
        type: mongoose.Schema.types.ObjectId,
        ref: "Course",
        required: true
    },

    userId: {
        type: mongoose.Schema.types.ObjectId,
        ref: "User",
        required: true
    },

    completedVideos: {
        type: mongoose.Schema.types.ObjectId,
        required: true
    }
});

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

export {
    CourseProgress
}