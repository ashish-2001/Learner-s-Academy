import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    fetchCourseDetails,
    getFullDetailsOfCourse
} from "../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";
import { RenderSteps } from "../AddCourse/RenderSteps";

function EditCourse(){
    const dispatch = useDispatch();
    const { courseId } = useParams();
    const { course } = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        ;(async() => {
            setLoading(true)
            const result = await getFullDetailsOfCourse(courseId, token)
            if(result?.courseDetails){
                dispatch(setEditCourse(true))
                dispatch(setCourse(result?.courseDetails))
            }
            setLoading(false)
        })()
    }, []);

    if(loading){
        return(
            <div className="grid flex-1 place-items-center">
                <div className="spinner"></div>
            </div>
        )
    }

    return(
        <div className="mb-
        9"></div>
    )
}


export { EditCourse}