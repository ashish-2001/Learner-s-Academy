import React from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import { ConfirmationModalData } from "../../../../Common/ConfirmationModal";
import { SubSectionModal } from "./SubSectionModal";
import { useState } from "react";

function NestedView({ handleChangeEditSectionName }){
    const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [addSubSection, setAddSubSection] = useState(null);
    const [viewSubSection, setViewSubSection] = useState(null);
    const [editSubSection, setEditSubSection] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);

    const handleDeleteSection = async (sectionId) => {
        const result = await deleteSection({
            sectionId,
            courseId: course._id,
            token
        })
        if(result){
            dispatch(setCourse(result))
        }
        setConfirmationModal(null)
    }

    const handleDeleteSubSection = async (subSectionId, sectionId) => {
        const result = await deleteSubSection({subSectionId, sectionId, token})
        if(result){
            const updatedCourseContent = course.courseContent.map((section) => section._id === sectionId ? result : section)
            const updatedCourse = {...course, courseContent: updatedCourseContent}
            dispatch(setCourse(updatedCourse))
        }
        setConfirmationModal(null)
    }

    return(
        <>
        <div id="nestedViewContainer" className="rounded-lg bg-blue-950 p-6 px-8">
            {course?.courseContent?.map((section) => (
                <details key={section._id} open>
                    <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-blue-950 py-2">
                        <div className="flex items-center gap-x-3">
                            <RxDropdownMenu className="text-2xl text-white"/>
                            <p className="font-semibold text-white">
                                {section.sectionName}
                            </p>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <button onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}>
                                <MdEdit className="text-xl text-white"/>
                            </button>
                            <button onClick={() => setConfirmationModal({
                                text1: "Delete this section",
                                text2: "All the lectures in this section will be deleted",
                                btn1text: "Delete",
                                btn2Text: "Cancel",
                                btn1Handler: () => handleDeleteSection(section._id),
                                btn2Handler: () => setConfirmationModal(null)
                            })}>
                                <RiDeleteBin6Line className="text-xl text-white"/>
                            </button>
                            <span className="font-medium text-white">|</span>
                            <AiFillCaretDown className="text-xl text-white"/>
                        </div>
                    </summary>
                    <div className="px-6 pb-4">
                        {section.subSection.map((data) => (
                            
                                <div key={data?.id} onClick={() => setViewSubSection(data)} className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-blue-950 py-2">
                                    <div className="flex items-center gap-x-3 py-2">
                                        <RxDropdownMenu className="text-2xl text-white"/>
                                        <p className="font-semibold text-white">
                                            {data.title}
                                        </p>
                                    </div>
                                    <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-x-3">
                                        <button onClick={() => setEditSubSection({...data, sectionId: section._id})}>
                                            <MdEdit className="text-xl text-white"/>
                                        </button>
                                        <button onClick={() => 
                                            setConfirmationModal({
                                                text1:"Delete this Sub-Section",
                                                text2: "This lecture will be deleted",
                                                btn1Text: "Delete",
                                                btn2Delete: "Cancel",
                                                btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                                                btn2Handler: () => setConfirmationModal(null)
                                            })
                                            }
                                            >
                                                <RiDeleteBin6Line className="text-xl text-white"/>
                                            </button>
                                    </div>
                                </div>
                        ))}
                        <button onClick={() => setAddSubSection(section._id)} className="mt-3 flex items-center gap-x-1 text-yellow-600">
                            <FaPlus className="text-lg"/>
                            <p>Add Lecture</p>
                        </button>
                    </div>
                </details>
            ))}
        </div>
        {addSubSection ? (
            <SubSectionModal
                modalData={addSubSection}
                add={true}
            />
        ) : (
            viewSubSection ? (
                <SubSectionModal
                    modalData={viewSubSection}
                    setModalData={setViewSubSection}
                    view={true}
                />
            ) : editSubSection ? (
                <SubSectionModal
                    modalData={viewSubSection}
                    setModalData={setViewSubSection}
                    view={true}
                />
            ) : (
                <></>
            )
        )}
        {confirmationModal ? (
            <ConfirmationModalData modalData={confirmationModal}/>
        ) : (
            <></>
        )}
        </>
    )
}

export {
    NestedView
}