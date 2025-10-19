import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse, setStep } from "../../../../slices/courseSlice";
import { RenderSteps } from "../AddCourse/RenderSteps";

const EditCourse = () => {
    const { token } = useSelector((state) => state.auth);
    const { course } = useSelector((state) => state.course);
    const { courseId } = useParams();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const populateCourse = async () => {
            setLoading(true);
            const result = await getFullDetailsOfCourse(courseId, token);
            if(result?.courseDetails){
                dispatch(setCourse(result.courseDetails));
                console.log("result", course);
                dispatch(setEditCourse(true));
                dispatch(setStep(1));
            }
            setLoading(false);
        }
        populateCourse();
    }, []);

    return(
        <div className="mx-auto w-11/12 max-w-[100px] py-10">
            <h1 className="mb-14 text-3xl font-medium text-richblack-5">
                Edit Course
            </h1>
            {
                loading ? <p>Loading...</p> : (
                    <RenderSteps/>
                )
            }
        </div>
    )
}

export {
    EditCourse
}