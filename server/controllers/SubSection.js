import { z } from "zod";
import { uploadImageToCloudinary } from "../utils/ImageUploader.js";
import { SubSection } from "../models/SubSection.js";
import { Section } from "../models/Section.js";
import { Course } from "../models/Course.js";

const subSectionValidator = z.object({
    sectionId: z.string().min(1, "Section id is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    courseId: z.string().min(1, "Course id is required")
})

async function createSubSection(req, res){

    try{
        const parsedResult = subSectionValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                message: "All the fields are required",
                errors: parsedResult.error.errors
            })
        }

        const { sectionId, title, description, courseId } = parsedResult.data;

        const video = req.files.videoFile;

        const ifSection = await Section.findById(sectionId);
        if(!ifSection){
            return res.status(404).json({
                success: false,
                message: "Section not found"
            })
        }

        const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME || "default"
        )
        console.log(uploadDetails)

        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url
        })

        const updatedSection = await Section.findByIdAndUpdate({
            _id: sectionId
        }, {
            $push: {
                subSection: SubSectionDetails._id
            }
        }, {
            new: true
        }).populate("subSection");

        console.log(updatedSection)

        const updatedCourse = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec();

        return res.status(200).json({
            success: true,
            message: "Sub-section created successfully",
            data: updatedCourse
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: e.message
        })
    }
}

const updateSubSectionValidator = z.object({
    sectionId: z.string().min(1, "Section id is required"),
    subSectionId: z.string().min(1, "Sub Section id is required"),
    title: z.string().optional(),
    description: z.string().optional()
})

async function updateSubSection(req, res) {

    try{

        const parsedResult = updateSubSectionValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                errors: parsedResult.error.errors
            })
        }

        const { subSectionId, title, description, courseId } = parsedResult.data;

        const video = req?.files?.videoFile;

        let uploadDetails = null;

        if(video){
            uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_VIDEO
            )
        }

        await SubSection.findByIdAndUpdate({ _id: subSectionId}, {
            title: title || SubSection.title,
            description: description || SubSection.description,
            videoUrl: uploadDetails?.secure_url
        }, { new: true });

        const updatedCourse = await Course.findById(courseId).populate({ path: "courseContent", populate: { path: "subSection" }}).exec();

        return res.status(200).json({
            success: true,
            message: "Sub section updated successfully",
            data: updatedCourse
        });
        
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: e.message
        })
    }
}

const deleteSubSectionValidator = z.object({
    subSectionId: z.string().min(1, "Sub-section is required"),
    courseId: z.string().min(1, "Section id is required")
})

async function deleteSubSection(req, res){
    try{

        const parsedResult = deleteSubSectionValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(404).json({
                success: false,
                message: "All fields are required",
                errors: parsedResult.error.errors
            })
        }

        const{ subSectionId, courseId } = parsedResult.data;

        const sectionId = req.body.sectionId;

        if(!subSectionId || !sectionId){
            return res.status(404).json({
                success: false,
                message: "all fields are required"
            })
        }

        const ifSubSection = await SubSection.findById({ _id: subSectionId});
        const ifSection = await Section.findById({ _id: sectionId });

        if(!ifSubSection){
            return res.status(404).json({
                success: false,
                message: "Sub section not found"
            });
        }

        if(!ifSection){
            return res.status(404).json({
                success: false,
                message: "Section not found"
            })
        }

        await SubSection.findByIdAndDelete(subSectionId);
        await Section.findByIdAndUpdate({
            _id: sectionId
        }, {
            $pull: {
                subSection: subSectionId
            }
        }, { new: true });

        const updatedCourse = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec();

        return res.status(200).json({
            success: true,
            message: "Sub section deleted successfully",
            data: updatedCourse
        })
    }
    catch(e){
        return res.status(500).json({
            success: true,
            message: "internal server error",
            error: e.message
        })
    }
}


export {
    createSubSection,
    updateSubSection,
    deleteSubSection
}