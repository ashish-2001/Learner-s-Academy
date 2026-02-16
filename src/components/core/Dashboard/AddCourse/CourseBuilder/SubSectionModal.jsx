import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import {
    createSubSection,
    updateSubSection
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import { IconBtn } from "../../../../common/IconBtn";
import { Upload } from "./Upload";

function SubSectionModal({
    modalData,
    setModalData,
    add = false,
    view = false,
    edit = false
}){

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((state) => state.auth)
    const { course } = useSelector((state) => state.course) 

    const {
        register,
        handleSubmit,
        formState: { errors }, 
        setValue,
        getValues
    } = useForm();

    useEffect(() => {
        if(view || edit){
            setValue("lectureTitle", modalData.title)
            setValue("lectureDesc", modalData.description);
            setValue("lectureVideo", modalData.videoUrl)
        }
    }, [view, edit]);

    const isFormUpdated = () => {
        const currentValues = getValues();
        if(currentValues.lectureTitle !== modalData.title || 
            currentValues.lectureDesc !== modalData.description || 
            currentValues.lectureVideo !== modalData.videoUrl
        ){
            return true;
        }
        return false;
    }

    const handleEditSubSection = async (data) => {
        const currentValues = getValues();
        const formData = new FormData();
        formData.append("SubSectionId", modalData._id);
        if(currentValues.lectureTitle !== modalData.title){
            formData.append("title", data.lectureTitle)
        }
        if(currentValues.lectureDesc !== modalData.description){
            formData.append("description", data.lectureDesc)
        }
        if(currentValues.lectureVideo !== modalData.videoUrl){
            formData.append("videoFile", data.lectureVideo)
        }
        formData.append("courseId", course._id);
        
        const result = await updateSubSection(formData, token);

        if(result){
            dispatch(setCourse(result));
        }

        setModalData(null);
    }


    const onSubmit = async (data) => {
        if(view){
            return;
        }
        if(edit){
            if(!isFormUpdated()){
                toast.error("No changes made")
            }
            else{
                handleEditSubSection(data);
            }
            return;
        }

        const formData = new FormData();
        formData.append("sectionId", modalData);
        formData.append("title", data.lectureTitle);
        formData.append("description", data.lectureDesc)
        formData.append("videoFile", data.lectureVideo)
        formData.append("courseId", course._id);

        console.log("Form data", [...formData]);
        
        const result = await createSubSection(formData, token);

        console.log("Result", result);

        if(result){
            dispatch(setCourse(result));
        }
        setModalData(null);
    }
        return (
        <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
            <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-[#6E727F] bg-[#161D29]">
                <div className="flex items-center justify-between rounded-t-lg bg-[#2C333F] p-5">
                    <p className="text-xl font-semibold text-white">
                        {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
                    </p>
                    <button onClick={() => (!loading ? setModalData(null) : {})}>
                        <RxCross1 size={20} className="text-2xl text-[#F1F2FF]"/>
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
                        <label className="text-sm text-[#F1F2FF]" htmlFor="lectureTitle">
                            Lecture title {!view && <sup className=" text-red-600">*</sup>}
                        </label>
                        <input
                            disabled={view}
                            id="lectureTitle"
                            placeholder="Enter lecture title"
                            { ...register("lectureTitle", { required: true }) }
                            className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full !pr-10 py-2 px-3 border-2 border-white hover:border-2 hover:border-white"
                        />
                        {errors.lectureTitle && (
                            <span className="ml-2 text-xs tracking-wide text-red-600">
                                Lecture title is required
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm text-[#F1F2FF]" htmlFor="lectureDesc">
                            Lecture Description{" "}
                            {!view && <sup className="text-red-600">*</sup>}
                        </label>
                        <textarea
                            disabled={view}
                            id="lectureDesc"
                            placeholder="Enter lecture Description"
                            { ...register("lectureDesc", { required: true}) }
                            className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none !pr-10 resize-x-none min-h-[130px] w-full py-2 px-3 hover:border-2 hover:border-white border-2 border-white"
                        />
                        {errors.lectureDesc && (
                            <span className="mi-2 text-xs tracking-wide text-red-600">
                                Lecture description is required
                            </span>
                        )}
                    </div>
                    {!view && (
                        <div className="flex justify-end">
                            <IconBtn text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}
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