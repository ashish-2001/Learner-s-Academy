import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { CourseReviewModal } from "../components/Core/ViewCourse/CourseReviewModal";
import { VideoDetailsSidebar } from "../components/Core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import {
    setCompletedLectures,
    setCourseSectionData,
    setEntireCourseData,
    setTotalNoOfLectures
} from "../slices/viewCourseSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

function ViewCourse(){
    const { courseId } = useParams();
    const { token } = useSelector((state) =>state.auth)
    const dispatch = useDispatch();
    const [reviewModal, setReviewModal] = useState(false);

    useEffect(() => {
        ;(async() => {
            const courseData = await getFullDetailsOfCourse(courseId, token);
            dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
            dispatch(setCompletedLectures(courseData.completedVideos))
            dispatch(setEntireCourseData(courseData.courseDetails))

            let lectures = 0;
            courseData?.courseDetails?.courseContent?.forEach((sec) => {
                lectures += sec.subSection.length
            })
            dispatch(setTotalNoOfLectures(lectures))
        })()
    }, [])

    return(
        <>
            <div className="relative flex min-h-[calc(100vh-3.5rem)]">
                <VideoDetailsSidebar setReviewModal={setReviewModal}/>
                <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                    <div className="mx-6">
                        <Outlet/>
                    </div>
                </div>
            </div>
            {reviewModal && <CourseReviewModal setReviewModal={setReviewModal}/>}
        </>
    )
}


export {
    ViewCourse
}