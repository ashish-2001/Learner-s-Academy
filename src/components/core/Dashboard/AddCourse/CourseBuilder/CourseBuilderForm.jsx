import React from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { createSection, updateSection } from "../../../../../services/operations/courseDetailsAPI";
import{ setCourse, setEditCourse, setStep } from "../../../../../slices/courseSlice";
import { IconBtn } from "../../../../Common/IconBtn";
import { NestedView } from "./NestedView";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";


function CourseBuilderForm(){

    const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false);
    const [editSectionName, setEditSectionName] = useState(null);
    const dispatch = useDispatch();

    const { 
        register, 
        handleSubmit, 
        setValue, 
        getValues,
        formState: { errors }
    } = useForm();

    const goToNext = () => {
        if(course.courseContent.length > 0){
            if(course.courseContent.some((Section) => section.subSection.length > 0)){
                dispatch(setStep(3));
            }else{
                toast.error("Please add at least one lesson to each section");
            }
        }else{
            toast.error("Please add at least one section to continue");
        }
    };

    const onSubmit = async (data) => {

        setLoading(true);

        let result = null;

        if(editSectionName){
            result = await updateSection(
                {
                    sectionName: data.sectionName,
                    sectionId: editSectionName,
                    courseId: course._id
                },
                token
            )
        } else{
            result = await createSection(
                {
                    sectionName: data.sectionName,
                    sectionId: editSectionName,
                    courseId: course._id
                },
                token
            )
        }
        if(result){
            dispatch(setCourse(result))
            setEditSectionName(false);
            setValue("sectionName", "")
        }
        setLoading(false)
    }

    const cancelEdit = () => {
        setEditSectionName(false)
        setValue("sectionName", "")
    }

    const handleChangeEditSectionName = (sectionId, sectionName) => {
        if(editSectionName === sectionId){
            cancelEdit()
            return;
        }
        setEditSectionName(sectionId)
        setValue("sectionName", sectionName)
    }

    const goBack = () => {
        dispatch(setStep(1))
        dispatch(setEditCourse(true))
    }

    return (
        <div className="space-y-8 rounded-md border-[1px] border-[#2C333F] bg-[#161D29] p-6">
            <p className="text-2xl font-semibold text-[#F1F2FF]">Course Builder</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <label className="text-sm text-[#F1F2FF]" htmlFor="sectionName">
                        Section Name <sup className="text-red-600 text-[20px] top-1">*</sup>
                    </label>
                    <input
                        id="sectionName"
                        disabled={loading}
                        placeholder="Add a section to build your course"
                        {...register("sectionName", { required: true })}
                        className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline w-full "
                    />
                    {errors.sectionName && (
                        <span className="ml-2 text-xs tracking-wide text-red-600">
                            Section name is required
                        </span>
                    )}
                </div>
                <div className="flex items-end gap-x-4">
                    <IconBtn 
                        type="submit"
                        disabled={loading}
                        text={editSectionName ? "Edit Section Name" : "Create Section"} outline={true}>
                            <IoAddCircleOutline size={20} className="text-[#FFD60A]"/>
                    </IconBtn>
                    {editSectionName && (
                        <button type="button" onClick={cancelEdit} className="text-sm text-[#838894] underline">
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>
            {course.courseContent.length > 0 && (
                <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
            )}
            <div className="flex justify-end gap-x-3">
                <button onClick={goBack} className="flex cursor-pointer items-center gap-x-2 rounded-md bg-[#838894] py-[8px] px-[20px] font-semibold text-#000814">
                    Back
                </button>
                <IconBtn disabled={loading} text="text" onClick={goToNext}>
                    <MdNavigateNext/>
                </IconBtn>
            </div>
        </div>
    )
}


export { 
    CourseBuilderForm
}