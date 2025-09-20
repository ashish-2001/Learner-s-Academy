import { z } from "zod";
import { CourseProgress } from "../models/CourseProgress";
import { SubSection } from "../models/SubSection";

const updateCourseProgressValidator = z.object({
    courseId: z.string().min(1, "Course id is required"),
    subSectionId: z.string().min(1, "Sub-section id is required")
});

async function updateCourseProgress(req, res){

    try{
        const { courseId, subSectionId } = updateCourseProgressValidator.safeParse(req.body);

        const userId = req.user.id;

        const subsection = await SubSection.findById(subSectionId);

        if(!subsection){
            return res.status(404).json({
                error: "Invalid Sub-section"
            })
        }

        let courseProgress = await CourseProgress.findOne({
            courseId: courseId,
            userId: userId
        })

        if(!courseProgress){
            return res.status(404).json({
                success: false,
                message: "Course progress does not exist"
            })
        }

        if(courseProgress.completedVideos.includes(subSectionId)){
            return res.status(400).json({
                error: "Sub section already completed"
            })
        }

        courseProgress.completedVideos.push(subSectionId);

        await courseProgress.save();

        return res.status(200).json({
            message: "Course progress updated"
        })
    }
    catch(e){
        if(e instanceof z.ZodError){
            return res.status(400).json({
                success: false,
                errors: e.errors.map((e)=> e.message)
            })
        }

        return res.status(500).json({
            error: "Internal server error"
        })
    }
}

export {
    updateCourseProgress
}
