import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import {
    createSubSection,
    updateSubSection
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import { IconBtn } from "../../../../Common/IconBtn";
import { Upload } from "../Upload";
function SubSectionModal({
    modalData,
    setModalData,
    add = false,
    view = false,
    edit = false
}){
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }, 
        getValues
    } = useForm();

    const dispatch= useDispatch()
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((state) => state.auth)
    const { course } = useSelector((state) => state.course) 

    useEffect(() => {
        if(view || edit){
            setValue("lectureTitle", modalData.title)
            setValue("lectureDesc", modalData.description);
            setValue("lectureVideo", modalData.videoUrl)
        }
    }, [])

    const isFormUpdated = () => {
        const currentValues = getValues()
        if(currentValues.lectureTitle !== modalData.title || 
            currentValues.lectureDesc !== modalData.description || 
            currentValues.lectureVideo !== modalData.videoUrl
        ){
            return true
        }
        return false
    }

    const handleEditSubSection = async () => {
        const currentValues = getValues()
        const formData = new FormData();
        formData.append("sectionId", modalData.sectionId)
        formData.append("subSectionId", modalData._id)
        if(currentValues.lectureTitle !== modalData.title){
            formData.append("title", currentValues.lectureTitle)
        }
        if(currentValues.lectureDesc !== modalData.description){
            formData.append("description", currentValues.lectureDesc)
        }
        if(currentValues.lectureVideo !== modalData.videoUrl){
            formData.append("video", currentValues.lectureVideo)
        }
        setLoading(true)
        const result = await updateSubSection(formData, token)

        if(result){
            const updatedCourseContent = course.courseContent.map((section) => section._id === modalData.sectionId ? result : section)
            const updatedCourse = { ...course, courseContent: updatedCourseContent}
            dispatch(setCourse(updatedCourse))
        }
        setModalData(null)
        setLoading(false)
    }

    const onSubmit = async (data) => {
        if(view) return
        if(edit){
            if(!isFormUpdated()){
                toast.error("No changes made to the form")
            }
            else{
                handleEditSubSection
            }
            return
        }

        const formData = new FormData();
        formData.append("sectionId", modalData)
        formData.append("title", data.lectureTitle);
        formData.append("description", data.lectureDesc)
        formData.append("video", data.lectureVideo)
        setLoading(true)
        const result = await createSubSection(formData, token);

        if(result){
            const updatedCourseContent = course.courseContent.map((section) => section._id === modalData ? result : section)
            const updatedCourse = { ...course, courseContent: updatedCourseContent}
            dispatch(setCourse(updatedCourse))
        }
        setModalData(null)
        setLoading(false)
    }
    
    return (
        <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
            <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-white bg-blue-950">
                <div className="flex items-center justify-between rounded-t-lg bg-blue-950 p-5">
                    <p className="text-xl font-semibold text-white">
                        {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
                    </p>
                    <button onClick={() => (!loading ? setModalData(null) : {})}>
                        <RxCross2 className="text-2xl text-white"/>
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
                    <Upload
                        name="lectureVideo"
                        label="Lecture video"
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        video={true}
                        viewData={view ? modalData.videoUrl : null}
                        editData={edit ? modalData.videoUrl : null}
                    />
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-white" htmlFor="lectureTitle">
                            Lecture title {!view && <sup className="text-red-200">*</sup>}
                        </label>
                        <input
                            disabled={view || loading}
                            id="lectureTitle"
                            placeholder="Enter lecture title"
                            {...register("lectureTitle", {required: true})}
                            className="form-style w-full py-2 px-3 border-2 border-white hover:border-2 hover:border-white"
                        />
                        {errors.lectureTitle &&(
                            <span className="ml-2 text-xs tracking-wide text-red-600">
                                Lecture title is required
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-white" htmlFor="lectureDesc">
                            Lecture Description{" "}
                            {!view && <sup className="text-red-200">*</sup>}
                        </label>
                        <textarea
                            disabled={view || loading}
                            id="lectureDesc"
                            placeholder="enter lecture Description"
                            {...register("lectureDesc", { required: true})}
                            className="form-style resize-x-none min-h-[130px] w-full py-2 px-3 hover:border-2 hover:border-white border-2 border-white"
                        />
                        {errors.lectureDesc && (
                            <span className="mi-2 text-xs tracking-wide text-red-600">
                                Lecture description is required
                            </span>
                        )}
                    </div>
                    {!view && (
                        <div className="flex justify-end">
                            <IconBtn
                                disabled={loading}
                                text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}
                            />
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export {
    SubSectionModal
}