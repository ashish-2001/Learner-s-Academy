import React from "react";
import { useEffect, useState } from "react";
import  ProgressBar from "@ramonak/react-progress-bar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUserCourses as getUserEnrolledCourses } from "../../../services/operations/profileAPI";

function EnrolledCourses(){
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [progressData, setProgressData] = useState();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const getEnrolledCourses = async () => {
        setLoading(true);
        const response = await getUserEnrolledCourses(token, dispatch);
        console.log("getEnrolledCourses -> response", response?.courseProgress);
        setLoading(false);
        setEnrolledCourses(response?.courses);
        setProgressData(response?.courseProgress);
    };

    const totalNoOfLectures = (course) => {
        let total = 0;
        course.courseContent.forEach((section) => {
            total += section.subSection.length;
        });
        return total;
    };

    useEffect(() => {
        getEnrolledCourses();
    }, []);

    if(loading){
        return(
            <div className="flex h-[calc(100vh)] w-full justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#585D69]"></div>
            </div>
        );
    };

    return(
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
            <div className="text-3xl text-[#C5C7D4]">Enrolled Courses</div>
            {!enrolledCourses ? (
                <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                    <div>Loading...</div>
                </div>
            ) : !enrolledCourses.length ? (
                <p className="grid h-[10vh] w-full place-content-center text-[#F1F2FF]">
                    You have not enrolled in any course yet.
                </p>
            ) : (
                <div className="my-8 text-[#F1F2FF]">
                    <div className="flex rounded-t-lg bg-[#585D69]">
                        <p className="w-[45%] px-5 py-3">Course Name</p>
                        <p className="w-1/4 px-2 py-3">Duration</p>
                        <p className="flex-1 px-2 py-3">Progress</p>
                    </div>
                    { enrolledCourses.map((course, index) => (
                        <div 
                            key={index}
                            onClick={() => {
                                navigate(`view-course/${course._id}/section/${course.courseContent[0]._id}/sub-section/${course.course.courseContent[0].subSection[0]}`)
                            }}
                            className="flex items-center border border-[#2C333F] rounded-none"
                        >
                            <div className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3">
                                <img 
                                    src={course.thumbnail} 
                                    alt="" 
                                    className="h-14 w-14 rounded-lg object-cover"
                                />
                                <div className="flex max-w-xs flex-col gap-2">
                                    <p className="font-semibold">{course.courseName}</p>
                                    <p className="text-xs text-[#838894]">
                                        {
                                            course.courseDescription.length > 50
                                            ? `${course.courseDescription.slice(0, 50)} + '...'`
                                            : course.courseDescription
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
                            <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                                {
                                    progressData?.map((progress, index) => {
                                        if(progress?.courseId === course?._id){
                                            return (
                                                <div key={index}>
                                                    <p>Completed: {progress?.completedVideos?.length} / {totalNoOfLectures(course)}</p>
                                                    <ProgressBar
                                                        completed={progress?.completedVideos?.length / totalNoOfLectures(course) * 100 }
                                                        total={progress?.total}
                                                        height="8px"
                                                        isLabelVisible={false}
                                                    />
                                                </div>
                                            )
                                        }
                                        return null;
                                    })
                                }
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export {
    EnrolledCourses
};