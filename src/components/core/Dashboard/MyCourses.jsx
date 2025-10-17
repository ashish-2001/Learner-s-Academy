import React from "react";
import { useEffect, useState } from "react";
import { VscAdd } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import { IconBtn } from "../../Common/IconBtn";
import { CoursesTable } from "./InstructorCourses/CoursesTable";

function MyCourses(){
    
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try{
                const result = await fetchInstructorCourses(token)
                if(result){
                    setCourses(result);
                }
            }catch(error){
                console.error("Failed to fetch courses:", error);
            }
        }

        fetchCourses();

    }, [token])

    return(
        <div>
            <div className="mb-14 flex items-center justify-between">
                <h1 className="text-3xl font-medium text-[#F1F2FF]">My courses</h1>
                <IconBtn 
                    text={"Add Course"}
                    onClick={() => navigate("/dashboard/add-course")}
                >
                    <VscAdd/>
                </IconBtn>
            </div>
            {courses && <CoursesTable courses={courses} setCourses={setCourses}/>}
        </div>
    )
}

export {
    MyCourses
}