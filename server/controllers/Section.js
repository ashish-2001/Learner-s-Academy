import { success, z } from "zod";
import { Course } from "../models/Course";

const sectionValidator = z.object({
    sectionName: z.string().min(1, "Section name is required"),
    courseId: z.string().min(1, "Course id is required")
})

async function createSection(req, res){

    try{
        const parsedResult = sectionValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.sectionName(400).json({
                success: false,
                message: "Invalid input",
                errors: parsedResult.error.errors
            })
        }

        const { sectionName, courseId } = parsedResult.data;

        const newSection = await Section.create({
            sectionName
        })

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: { courseContent: newSection._id }
            }, 
            {
                new : true
            }
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec()

        if(!updatedCourse){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Interval server error",
            error: e.message
        })
    }
}

const updateSectionValidator = z.object({
    sectionName: z.string().min(1, "Section name is required"),
    sectionId: z.string().min(1, "Section id is required"),
    courseId: z.string().min(1, "Course id is required")
})

async function updateSection(req, res){
    try{
        const parsedResult = updateSectionValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(404).json({
                success: false,
                message: "Invalid input",
                errors: parsedResult.error.errors
            })
        }

        const { sectionName, sectionId, courseId } = parsedResult.data;

        const section = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true }
        )

        if(!section){
            return res.status(404).json({
                success: false,
                message: "Section not found"
            })
        }

        const course = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec()

        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            updateSection: section,
            course
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

const deleteSectionValidator = z.object({
    sectionId: z.string().min(1, "Section id is required"),
    courseId: z.string().min(1, "Course id is required")
})

async function deleteSection(req, res){
    try{
        const parsedResult = deleteSectionValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(404).json({
                success: false,
                message: "Invalid input",
                errors: parsedResult.error.errors
            })
        }
        
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId
            }
        })

        const section = await Section.findById(sectionId);

        if(!Section){
            return res.status(404).json({
                success: false,
                message: "Section not found"
            })
        }

        await SubSection.deleteMany({
            _id: {
                $in: section.subSection
            }
        })

        await Section.findByIdAndUpdate(sectionId)

        const course = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec()

        res.status(200).json({
            success: true,
            message: "Section deleted",
            data: course
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

export{
    createSection,
    updateSection
}