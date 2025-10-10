import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({

    gender: {
        type: String,
        required: false
    },

    dateOfBirth: {
        type: String,
        required: false
    },

    about: {
        type: String,
        required: false
    },

    contactNumber: {
        type: Number,
        required: false
    }
})

const Profile = mongoose.model("Profile", profileSchema);

export {
    Profile
}