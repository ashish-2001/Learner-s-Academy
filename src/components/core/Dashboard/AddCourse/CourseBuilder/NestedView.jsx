import React from "react";
import { RxDropdownMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import { ConfirmationModalData } from "../../../../common/ConfirmationModal";
import { SubSectionModal } from "./SubSectionModal";
import { useState } from "react";
import { VscAdd, VscEdit, VscTrash, VscTriangleDown } from "react-icons/vsc";

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
        }, token);

        if(result){
            dispatch(setCourse(result));
            setConfirmationModal(null);
        }
    }

    const handleDeleteSubSection = async (subSectionId, sectionId) => {
        const result = await deleteSubSection({subSectionId, sectionId, courseId: course._id}, token)
        if(result){
            dispatch(setCourse(result));
            setConfirmationModal(null);
        }
    }

    return(
        <div>
        <div>
            {course?.courseContent?.map((section) => (
                <details key={section._id} open className="mt-4">
                    <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-[#424854] py-2">
                        <div className="flex items-center gap-x-3">
                            <RxDropdownMenu className="text-2xl text-[#C5C7D4]"/>
                            <p className="font-semibold text-[#C5C7D4]">
                                {section.sectionName}
                            </p>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <button >
                                <VscEdit 
                                    className="text-xl text-[#838894]"
                                    onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}
                                />
                            </button>
                            <button>
                                <VscTrash size={24}
                                    className="text-xl text-[#838894]"
                                    onClick={() => {
                                        setConfirmationModal({
                                            text1: "Delete this section",
                                            text2: "All the lectures in this section will be deleted",
                                            btn1text: "Delete",
                                            btn2Text: "Cancel",
                                            btn1Handler: () => handleDeleteSection(section._id),
                                            btn2Handler: () => setConfirmationModal(null)
                                        })
                                    }}
                                />
                            </button>
                            <span className="font-medium text-[#838894]">|</span>
                            <VscTriangleDown className="text-xl text-[#838894]"/>
                        </div>
                    </summary>

                    <div className="px-6 pb-4">
                        {
                            section.subSection.map((subSection) => (
                            
                                <div 
                                    key={subSection?.id} 
                                    onClick={(e) => {
                                    if(e.currentTarget != e.target ) return; setViewSubSection(subSection);}}
                                    className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-[#001B1D] py-2"
                                >
                                    <div className="flex items-center gap-x-3">
                                        <RxDropdownMenu className="text-2xl text-[#C5C7D4]" size={25} />
                                        <p className="font-semibold text-[#C5C7D4]">
                                            {subSection.title}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-x-3">
                                        <button>
                                            <VscEdit 
                                                onClick={() => 
                                                    setEditSubSection(subSection)
                                                }
                                                className="text-xl text-[#838894]"
                                            />
                                        </button>
                                        <button> 
                                            <VscTrash size={21} onClick={() => {
                                                setConfirmationModal({
                                                    text1:"Delete this Sub-Section",
                                                    text2: "Selected lecture will be deleted",
                                                    btn1Text: "Delete",
                                                    btn2Delete: "Cancel",
                                                    btn1Handler: () => handleDeleteSubSection(subSection._id, section._id),
                                                    btn2Handler: () => setConfirmationModal(null)
                                                })
                                            }}/>
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                        <button 
                            onClick={() => setAddSubSection(section._id)} 
                            className="mt-3 flex items-center gap-x-1 text-[#FFD60A]"
                        >
                            <VscAdd className="text-lg text-yellow-50"/>
                            <p>Add Lecture</p>
                        </button>
                    </div>
                </details>
            ))}
        </div>
        { 
            addSubSection ? <SubSectionModal modalData={addSubSection} setModalData={setAddSubSection} add={true} /> : 
                editSubSection ? <SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit={true} /> :
                viewSubSection ? <SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit={true} /> :   null
        }
        {
            confirmationModal ? <ConfirmationModalData modalData={confirmationModal} setConfirmationModal={setConfirmationModal} /> : null
        }
        </div>
    )
}

export {
    NestedView
}