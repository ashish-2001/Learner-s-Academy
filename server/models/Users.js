import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    
    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    accountType: {
        type: String,
        enum: ["Student", "Instructor", "Admin"],
        required: true
    },

    active:{
        type: Boolean,
        required: true
    },

    approved: {
        type: Boolean,
        default: true
    },

    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ],

    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true
    },

    image: {
        type: String
    },

    resetPasswordExpires: {
        type: Date
    },

    token: {
        type: String
    },

    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "courseProgress"
        }
    ]
}, { timestamps: true }

);

const User = mongoose.model("User", userSchema);

export {
    User
}