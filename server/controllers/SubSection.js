import { z } from "zod";
import { uploadImageToCloudinary } from "../utils/ImageUploader.js";
import { SubSection } from "../models/SubSection.js";
import { Section } from "../models/Section.js";

const subSectionValidator = z.object({
    sectionId: z.string().min(1, "Section id is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),

})

async function createSubSection(req, res){

    try{
        const parsedResult = subSectionValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
                errors: parsedResult.error.errors
            })
        }

        const { sectionId, title, description } = parsedResult.data;

        const video = req.files.video;

        if(!sectionId || !title || !description || !video){
            return res.status(404).json({
                success: false,
                message: "All fields are required"
            })
        }

        console.log(video);

        const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
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
        }).populate("subSection")

        return res.status(200).json({
            success: true,
            message: "Sub-section created successfully",
            data: updatedSection
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
                message: "invalid input",
                errors: parsedResult.error.errors
            })
        }

        const { sectionId, subSectionId, title, description } = parsedResult.data;

        const subSection = await SubSection.findById(subSectionId);

        if(!subSection){
            return res.status(404).json({
                success: false,
                message: "SubSection not found"
            });
        }

        if(title !== undefined){
            subSection.title = title;
        }

        if(description !== undefined){
            subSection.description = description
        }

        if(req.files && req.files.video !== undefined){
            const video = req.files.video;
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )

            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save();

        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        )

        console.log("Updated section:", updatedSection);

        return res.status(200).json({
            success: true,
            message: "Sub section updated successfully",
            data: updatedSection
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
    sectionId: z.string().min(1, "Section id is required")
})

async function deleteSubSection(req, res){
    try{

        const parsedResult = deleteSubSectionValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(404).json({
                success: false,
                message: "Invalid input",
                errors: parsedResult.error.errors
            })
        }

        const{ subSectionId, sectionId } = parsedResult.data;

        await Section.findByIdAndUpdate({
            _id: sectionId
        }, {
            $pull: {
                subSection: subSectionId
            }
        })

        const subSection = await SubSection.findByIdAndDelete({_id: subSectionId})

        if(!subSection){
            return res.status(404).json({
                success: false,
                message: "Sub section not found"
            })
        }

        const updatedSection = await Section.findById(sectionId).populate("subSection")

        return res.status(200).json({
            success: true,
            message: "Sub section deleted successfully",
            data: updatedSection
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