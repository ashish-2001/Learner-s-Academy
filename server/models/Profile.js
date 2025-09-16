import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({

    gender: {
        type: String,
        required: true
    },

    dateOfBirth: {
        type: String,
        required: true
    },

    about: {
        type: String,
        required: true
    },

    contactNumber: {
        type: Number,
        required: true
    }
})

const Profile = mongoose.model("Profile", profileSchema);

export {
    Profile
}