import mongoose from "mongoose";

const subSectionSchema = new mongoose.Schema({

    title: {
        type: String
    },

    description: {
        type: String
    },

    videoUrl: {
        type: String
    },

    timeDuration: {
        type: String
    }
});

const SubSection = mongoose.model("SubSection", subSectionSchema);

export {
    SubSection
};