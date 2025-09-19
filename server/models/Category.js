import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    courses: [{
        type: mongoose.Schema.types.ObjectId,
        ref: "Course"
    }]
});

const Category = mongoose.model("Category", categorySchema);

export {
    Category
}