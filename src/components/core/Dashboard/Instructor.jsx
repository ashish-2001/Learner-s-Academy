import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import { getInstructorData } from "../../../services/operations/profileAPI";
import { InstructorChart } from "./InstructorDashboard/InstructorChart";
import { useSelector } from "react-redux";

function Instructor(){
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const [loading, setLoading] = useState(false);
    const [instructorData, setInstructorData] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        ;(async () => {
            setLoading(true)
            const instructorApiData = await getInstructorData(token)
            const result = await fetchInstructorCourses(token);
            if(instructorApiData.length){
                setInstructorData(instructorApiData);
            }
            if(result){
                setCourses(result)
            }
            setLoading(false)
        })()
    },[])

    const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0)

    const totalStudents = instructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0)

    return(
        <div>
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-[#F1F2FF]">
                    Hi {user?.firstName}
                </h1>
                <p className="font-medium text-[#999DAA]">
                    Lets start something new
                </p>
            </div>
            {loading ? (
                <div className="spinner"></div>
            ) : courses.length > 0 ? (
                <div>
                    <div className="my-4 flex h-[450px] space-x-4">
                        {totalAmount > 0 || totalStudents > 0 ? (
                            <InstructorChart courses={instructorData}/>
                        ) : (
                            <div className="flex-1 rounded-md bg-[#161D29] p-6">
                                <p className="text-lg font-bold text-[#F1F2FF]">Visualize</p>
                                <p className="mt-4 text-xl font-medium text-[#C5C7D4]">
                                    Not Enough Data to Visualize
                                </p>
                            </div>
                        )}
                        <div className="flex min-w-[250px] flex-col rounded-md bg-[#161D29] p-6">
                            <p className="text-lg font-bold text-[#F1F2FF]">Statistics</p>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <p className="text-lg text-[#999DAA]">
                                        Total Courses
                                    </p>
                                    <p className="text-3xl font-semibold text-[#C5C7D4]">
                                        {courses.length}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg text-[#999DAA]">Total Students</p>
                                    <p className="text-3xl font-semibold text-[#C5C7D4]">
                                        {totalStudents}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg text-[#999DAA]">Total Income</p>
                                    <p className="text-3xl font-semibold text-[#C5C7D4]">Rs. {totalAmount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-md bg-[#161D29] p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-[#F1F2FF]">Your Courses</p>
                            <Link to={"/dashboard/my-courses"}>
                                <p className="text-xs font-semibold text-[#FFD60A]">View All</p>
                            </Link>
                        </div>
                        <div className="my-4 flex items-start space-x-6">
                            {courses.slice(0, 3).map((course) => (
                                <div className="w-1/3" key={course._id}>
                                    <img
                                        src={course.thumbnail}
                                        alt={course.courseName}
                                        className="h-[201px] w-full rounded-md object-cover"
                                    />
                                    <div className="mt-3 w-full">
                                        <p className="text-sm font-medium text-[#C5C7D4]">
                                            {course.courseName}
                                        </p>
                                        <div className="mt-1 flex items-center space-x-2">
                                            <p className="text-xs font-medium text-[#838894]">
                                                {course.totalStudents.length} students
                                            </p>
                                            <p className="text-xs font-medium text-[#838894]">
                                                |
                                            </p>
                                            <p className="text-xs font-medium text-[#838894]">
                                                Rs. {course.price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-20 rounded-md bg-[#161D29] p-6 py-20">
                    <p className="text-center text-2xl font-bold text-[#F1F2FF]">
                        You have not created any courses yet
                    </p>
                    <Link to={"/dashboard/add-course"}>
                        <p className="mt-1 text-center text-lg font-semibold text-[#FFD60A]">
                            Create a course    
                        </p>
                    </Link>
                </div>
            )}
        </div>
    )
}

export {
    Instructor
}