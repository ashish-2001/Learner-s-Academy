import React, { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { IconBtn } from "../../Common/IconBtn";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function VideoDetailsSidebar({ setReviewModal }){
    const [activeStatus, setActiveStatus] = useState("");
        const [videoBarActive, setVideoBarActive] = useState("");
        const navigate = useNavigate();
        const location = useLocation();
        const { sectionId, subSectionId } = useParams();
        const { courseSectionData, courseEntireData, totalNoOfLectures, completedLectures } = useSelector((state) => state.viewCourse);

        useEffect(() => {
            ;(() => {
                if(!courseSectionData.length) return
                const currentSectionIndex = courseSectionData.findIndex(
                    (data) => data._id === sectionId
                )

                const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
                    (data) => data._id === subSectionId
                )

                const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id
                setActiveStatus(courseSectionData?.[currentSectionIndex]?._id)
                setVideoBarActive(activeSubSectionId)
            })()
        }, [courseSectionData, courseEntireData, location.pathname])
    

    return (
        <>
            <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-[#2C333F] bg-[#161D29]">
                <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-[#424854] py-5 text-lg font-bold text-[#DBDDEA]">
                    <div className="flex w-full items-center justify-between ">
                        <div onClick={() => {
                            navigate(`/dashboard/enrolled-courses`)
                        }} 
                        className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-[#AFB2BF] p-1 text-[#2C333F] hover:scale-90" title="back">
                            <IoIosArrowBack size={30}/>
                        </div>
                        <IconBtn
                            text={"Add Review"}
                                customClasses="ml-auto"
                                onClick={() => setReviewModal(true)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <p>{courseEntireData?.courseName}</p>
                        <p className="text-sm font-semibold text-[#585D69]">
                            {completedLectures?.length} / {totalNoOfLectures}
                        </p>
                    </div>
                </div>
                <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
                    {courseSectionData.map((course, index) => (
                        <div className="mt-2 cursor-pointer text-sm text-[#F1F2FF]" onClick={() => setActiveStatus(course?._id)} key={index}>
                            <div className="flex flex-row justify-between bg-[#424854] px-5 py-4">
                                <div className="w-[70%] font-semibold">
                                    {course?.sectionName}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`${activeStatus === course?.sectionName ? "rotate-0" : "rotate-180"} transition-all duration-200`}>
                                        <BsChevronDown/>
                                    </span>
                                </div>
                            </div>
                            {activeStatus === course?._id && (
                                <div className="transition-[height] duration-500 ease-in-out">
                                    {course.subSection.map((topic, i) => (
                                        <div className={`flex gap-3 px-5 py-2 ${
                                            videoBarActive === topic._id
                                            ? "bg-[#CFAB08] font-semibold text-[#161D29]"
                                            : "hover:bg-[#000814]"
                                        }`} key={i} onClick={() => {
                                            navigate(`/view-course/${courseEntireData?._id}/section/${course?._id}/xub-section/${topic?._id}`)
                                            setVideoBarActive(topic._id)
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={completedLectures.includes(topic?._id)}
                                                onChange={() => {}}
                                            />
                                            {topic.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        ))}
                </div>
            </div>
        </>
    )
}


export {
    VideoDetailsSidebar
}