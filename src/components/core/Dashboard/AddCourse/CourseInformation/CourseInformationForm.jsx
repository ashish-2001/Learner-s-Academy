import React from "react";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
    addCourseDetails,
    editCourseDetails,
    fetchCourseCategories
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { IconBtn } from "../../../../Common/IconBtn";
import { Upload } from "../Upload";
import { ChipInput } from "./ChipInput";
import { RequirementsField } from "./RequirementsField";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function CourseInformationForm(){
    const { register, handleSubmit, setValue, getValues, formState: { errors}} = useForm();

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth)
    const { course, editCourse } = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const [courseCategories, setCourseCategories] = useState();

    useEffect(() => {
        const getCategories = async () => {
            setLoading(true)
            const categories = await fetchCourseCategories();
            if(categories.length > 0){
                setCourseCategories(categories)
            }
            setLoading(false)
        }

        if(editCourse){
            setValue("courseTitle", course.courseName)
            setValue("courseShortDesc", course.courseDescription)
            setValue("coursePrice", course.price);
            setValue("courseTags", course.tags);
            setValue("courseBenefits", course.whatWillYouLearn);
            setValue("courseCategory", course.category);
            setValue("courseRequirements", course.instructions);
            setValue("courseImage", course.thumbnail)
        }
        getCategories()
    }, [])

    const isFormUpdated = () => {
        const currentValues = getValues();
        if(
            currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags.toString() !== course.tag.toString() || 
            currentValues.courseBenefits !== course.whatWillYouLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseRequirements.toString() ||
            course.instructions.toString() ||
            currentValues.courseImage !== course.thumbnail
        ){
            return true
        }
        return false
    }

    const onSubmit = async(data) => {
        if(editCourse){
            if(isFormUpdated()){
                const currentValues = getValues();
                const formData = new FormData()
                formData.append("courseId", course._id)
                if(currentValues.courseTitle !== course.courseName){
                    formData.append("courseName", data.courseTitle)
                }
                if(currentValues.courseShortDesc !== course.courseDescription){
                    formData.append("courseDescription", data.courseShortDesc)
                }
                if(currentValues.coursePrice !== course.price){
                    formData.append("price", data.coursePrice)
                }
                if(currentValues.courseTags.toString() !== course.tag.toString()){
                    formData.append("tag", JSON.stringify(data.courseTags))
                }
                if(currentValues.courseBenefits !== course.whatWillYouLearn){
                    formData.append("whatWillYouLearn", data.courseBenefits)
                }
                if(currentValues.courseCategories._id !== course.category._id){
                    formData.append("category", data.courseCategory)
                }
                if(currentValues.courseRequirements.toString() !== course.instructions.toString()){
                    formData.append("instructions", JSON.stringify(data.courseRequirements))
                }
                if(currentValues.courseImage !== course.thumbnail){
                    formData.append("thumbnailImage", data.courseImage)
                }

                setLoading(true)
                const result = await editCourseDetails(formData, token)
                setLoading(false)
                if(result){
                    dispatch(setStep(2))
                    dispatch(setCourse(result))
                }
            } else{
                toast.error("No changes made to the form")
            }
            return
        }

        const formData = new FormData();
        formData.append("courseName", data.courseTitle)
        formData.append("courseDescription", data.courseShortDesc);
        formData.append("price", data.coursePrice);
        formData.append("tag", JSON.stringify(data.courseTags))
        formData.append("whatWillYouLearn", data.courseBenefits)
        formData.append("category", data.courseCategory)
        formData.append("status", COURSE_STATUS.DRAFT)
        formData.append("instructions", JSON.stringify(data.courseRequirements));
        formData.append("thumbnailImage", data.courseImage)
        setLoading(true)
        const result = await addCourseDetails(formData, token);
        if(result){
            dispatch(setStep(2))
            dispatch(setCourse(result));
        }
        setLoading(false)
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 rounded-md border-[1px] border-[#2C333F] bg-[#161D29] p-6">
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-[#F1F2FF]" htmlFor="courseTitle">
                    Course Title <sup className="text-red-600">*</sup>
                </label>
                <input
                    id="courseTitle"
                    placeholder="Enter Course Title"
                    {...register("courseTitle", { required: true})}
                    className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none !pr-10 w-full "
                />
                {errors.courseTitle && (
                    <span className="ml-2 text-xs tracking-wide text-red-600">
                        Course Title is required
                    </span>
                )}
            </div>
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-[#F1F2FF]" htmlFor="courseShortDesc">
                    Course Short Description <sup className="text-red-600">*</sup>
                </label>
                <textarea
                    id="courseShortDesc"
                    placeholder="Enter Description"
                    {...register("courseShortDesc", { required: true })}
                    className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none !pr-10 resize-x-none min-h-[130px] w-full"
                />
                {errors.courseShortDesc && (
                    <span className="ml-2 text-xs tracking-wide text-red-600">
                        Course Description is required
                    </span>
                )}
            </div>
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-[#F1F2FF]" htmlFor="CoursePrice">
                    Course Price <sup className="text-red-600">*</sup>
                </label>
                <div className="relative">
                    <input 
                        id="coursePrice"
                        placeholder="Enter Course Price"
                        {...register("coursePrice", {
                            required: true,
                            valueAsNumber: true,
                            pattern: {
                                value: /^(0|[1-9]\d*)(\.\d+)?$/
                            }
                        })} 
                        className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none !pr-10 w-full "
                    />
                    <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-[#6E727F] "/>
                </div>
                {errors.coursePrice && (
                    <span className="ml-2 text-xs tracking-wide text-red-600">
                        Course Price is required
                    </span>
                )}
            </div>
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-[#F1F2FF]" htmlFor="courseCategory">
                    Course Category <sup className="text-red-600">*</sup>
                </label>
                <select {...register("courseCategory", { required: true })} className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full !pr-10" defaultValue="" id="courseCategory">
                    <option value="" disabled>
                        Choose a Category
                    </option>
                    {!loading && courseCategories?.map((category, index) => (
                        <option key={index} value={category?._id}>{category?.name}</option>
                    ))}
                </select>
                {errors.courseCategory && (
                    <span className="ml-2 text-xs tracking-wide text-red-600">
                        Course Category is required
                    </span>
                )}
            </div>
            <ChipInput
                label={"Tags"}
                name={"courseTags"}
                placeholder={"Enter tags..."}
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
            />
            <Upload
                name="courseImage"
                label="Course Thumbnail"
                register={register}
                setValue={setValue}
                errors={errors}
                editCourse={editCourse ? course?.thumbnail : null}
            />
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-[#F1F2FF]" htmlFor="courseBenefits">
                    Benefits of the Course <sup className="text-red-600">*</sup>
                </label>
                <textarea
                    id="courseBenefits"
                    placeholder="Enter benefits of the course"
                    {...register("courseBenefits", { required: true})}
                    className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full !pr-10 resize-x-none min-h-[130px] "
                />
                {errors.courseBenefits && (
                    <span className="ml-2 text-xs tracking-wide text-red-600">
                        Benefits of the course is required
                    </span>
                )}
            </div>
            <RequirementsField
                name="courseRequirements"
                label="Requirements/Instructions"
                register={register}
                setValue={setValue}
                errors={errors}
                getValues={getValues}
            />
            <div className="flex justify-end gap-x-2">
                {editCourse && (
                    <button className="flex cursor-pointer items-center gap-x-2 rounded-md bg-[#838894] py-[8px] px-[20px] font-semibold text-[#000814]">
                        Continue Without Saving
                    </button>
                )}
                <IconBtn text={!editCourse ? "Next" : "Save Changes"} disabled={loading}>
                    <MdNavigateNext/>
                </IconBtn>
            </div>
        </form>
    )
}

export {
    CourseInformationForm
}