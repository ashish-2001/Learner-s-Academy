import React, { useEffect, useState } from "react";
import { getInstructorDashboard } from "../../../../services/operations/profileAPI";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { useNavigate } from "react-router-dom";
import { DashboardChart } from "./InstructorChart";

const InstructorDashboard = () => {

    const [details, setDetails] = useState([]);
    const [courses, setCourses] = useState([]);
    const [currentChart, setCurrentChart] = useState('revenue');
    const { token } = useSelector(state => state.auth);
    const { user }  = useSelector(state => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        ;(async () => {
            const instructorDetails = await getInstructorDashboard(token, dispatch);
            const instructorCourses = await fetchInstructorCourses(token);

            setCourses(instructorCourses);
            console.log("details", instructorDetails);
            console.log("Courses", instructorCourses);
            setDetails(instructorDetails);
        })();
    }, [token, dispatch]);

    const totalEarnings = details?.reduce((acc, course) => {
        return acc + (course?.totalRevenue || 0);
    }, 0);

    const totalStudents = details?.reduce((acc, course) => {
        return acc + (course?.totalStudents || 0);
    }, 0);

    return(
        <div>
            <div className="mx-auto w-[80%] py-10 text-white pr-10">
                <div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">
                            Hi {user?.firstName}
                        </h1>
                        <p className="font-medium ">Lets start something new</p>
                    </div>
                    <div className="my-4 flex flex-col-reverse gap-3 md:flex-row md:flex md:h-[450px] md:space-x-4">
                        <div className="p-6 flex flex-col flex-1 rounded-md">
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-bold text-white">
                                    Visualize
                                </p>
                                <div className="flex items-center space-x-4">
                                    <button 
                                        onClick={() => setCurrentChart('revenue')}
                                        className={`px-2 py-2 rounded-md ${currentChart === 'revenue' ? 'text-[#FFD60A] bg-black' : 'bg-black text-[#B69507]'}`}
                                    >
                                        Revenue
                                    </button>
                                    <button 
                                        onClick={() => setCurrentChart('students')} 
                                        className={`px-2 py-2 rounded-md ${currentChart === 'students' ? 'bg-black text-[#B69507]' : 'bg-black text-[#B69507]'}`}
                                    >
                                        Students
                                    </button>
                                </div>
                            </div>
                            <DashboardChart details={details || []} currentChart={currentChart}/>
                        </div>
                        <div className="flex min-w-[250px] flex-col rounded-md bg-black p-6">
                            <p className="text-lg font-bold text-[#F1F2FF]">
                                Statistics
                            </p>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <p className="text-lg text-[#999DAA]">
                                        Total courses
                                    </p>
                                    <p className="text-lg text-[#C5C7D4]">
                                        {courses?.length}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg text-[#999DAA]">Total students</p>
                                    <p className="text-3xl font-semibold text-[#C5C7D4]">{totalStudents}</p>
                                </div>
                                <div>
                                    <p className="text-lg text-[#999DAA]">Total Earnings</p>
                                    <p className="text-3xl font-semibold text-[#C5C7D4]">{totalEarnings}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rounded-md bg-richblack-800 p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-richblack-5">Your Courses</p>
                        <button onClick={() => {
                                navigate('dashboard/my-courses')
                            }}
                            className="text-xs font-semibold text-yellow-50"
                        >
                            View All
                        </button>
                    </div>
                    <div className="my-4 flex space-x-6">
                        {
                            courses?.length === 0 ?  <p className="text-sm font-medium text-richblack-300">You have not created any course</p> 
                            : courses?.slice(0, 3)?.map((course, index) => {
                                return (
                                    <div key={index} className="w-1/3">
                                        <img 
                                            src={course?.thumbnail}
                                            alt=""
                                            className="aspect-video md:h-[201px] w-full rounded object-cover"
                                        />
                                        <div className="mt-3 w-full">
                                            <p className="text-sm font-medium text-richblack-50">{course?.courseName}</p>
                                            <div className="mt-1 md:space-x-2 md:flex">
                                                <p className="text-xs font-medium text-richblack-300">{course?.studentsEnrolled?.length} Students</p>
                                                <p className="hidden md:block text-xs font-medium text-richblack-300">|</p>
                                                <p className="text-xs font-medium text-richblack-300">₹ {course?.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export { 
    InstructorDashboard
}