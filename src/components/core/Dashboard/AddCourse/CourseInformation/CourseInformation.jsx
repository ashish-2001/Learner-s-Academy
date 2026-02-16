import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '.././../../../../services/operations/courseDetailsAPI';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import { RequirementField } from './RequirementField';
import { setStep, setCourse } from '../../../../../slices/courseSlice';
import { IconBtn } from '../../../../common/IconBtn';
import { COURSE_STATUS } from '../../../../../utils/constants.js';
import { toast } from 'react-hot-toast';
import { Upload } from './Upload'
import { ChipInput } from './ChipInput';

const CourseInformationForm = () => {

    const dispatch = useDispatch();
    const { token } = useSelector((state)=> state.auth);
    const {course, editCourse} = useSelector((state)=> state.course);
    const [loading, setLoading] = useState(false);
    const [courseCategories, setCourseCategories] = useState([]);

    const methods = useForm({
        defaultValues: {
            courseTitle: "",
            courseShortDesc: "",
            coursePrice: "",
            courseBenefits: "",
            courseCategory: "",
            courseTags: [],
            courseRequirements: [],
            thumbnailImage: null
        }
    });

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = methods

    useEffect(()=> { 
        (async () => {
            const categories = await fetchCourseCategories();
            if(categories) {
                setCourseCategories(categories);
            }
        })();
    }, []);

    useEffect(() => {
        if(editCourse && course){
            setValue("courseTitle", course.courseName);
            setValue("courseShortDesc", course.courseDescription);
            setValue("coursePrice", course.price);
            setValue("courseTags", course.tag);
            setValue("courseBenefits", course.whatWillYouLearn);
            setValue("courseCategory", course.category?._id || course.category);
            setValue("courseRequirements", course.instructions);
            setValue("thumbnailImage", course.thumbnailImage);
        }
    }, [editCourse, course, setValue]);

    const onSubmit = async (data) => {

        const formData = new FormData();
        setLoading(true);

        if(editCourse){
            formData.append("courseId", course._id);
        }

        try{
            formData.append("courseName", data.courseTitle);
            formData.append("courseDescription", data.courseShortDesc);
            formData.append("price", data.coursePrice);
            formData.append("whatWillYouLearn", data.courseBenefits);
            formData.append("category", data.courseCategory);
            formData.append("instructions", JSON.stringify(data.courseRequirements));
            formData.append("status", COURSE_STATUS.DRAFT);
            formData.append("tag", JSON.stringify(data.courseTags));

            if(data.thumbnailImage && data.thumbnailImage instanceof File ){
                formData.append("thumbnailImage", data.thumbnailImage);
            }
                
            let result = null;

            if(editCourse){
                result = await editCourseDetails(formData, token);
            }else{
                result = await addCourseDetails(formData, token);
            }

            if(result){ 
                dispatch(setStep(2));
                dispatch(setCourse(result));
                toast.success("Course details saved successfully");
            }
        }
        catch(error){
            console.error("Course form submit error", error);
            toast.error("Failed to save course details")
        } finally{
            setLoading(false);
        }
    }

    return (
        <FormProvider {...methods}>
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-8 rounded-md border-[1px] border-[#2C333F] bg-[#161D29] p-6'
        >
            <div className='flex flex-col space-y-2'>
                <label className='text-sm text-[#F1F2FF]'  htmlFor='courseTitle'>Course Title<sup className='text-[#EF476F]'>*</sup></label>
                <input
                    id='courseTitle'
                    placeholder='Enter Course Title'
                    {...register("courseTitle", { required: true })}
                    className='rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full'
                />
                {
                    errors.courseTitle && (
                        <span className='ml-2 text-xs tracking-wide text-[#EF476F]'>Course Title is Required*</span>
                    )
                }
            </div>

            <div className='flex flex-col space-y-2'>
                <label className='text-sm text-[#F1F2FF]'  htmlFor='courseShortDesc'>Course Short Description<sup className='text--200'>*</sup></label>
                <textarea
                    id='courseShortDesc'
                    placeholder='Enter Description'
                    {...register("courseShortDesc", { required: true })}
                    className='rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none resize-x-none min-h-[130px] w-full'
                    />
                {
                    errors.courseShortDesc && (<span className='ml-2 text-xs tracking-wide text-[#EF476F]'>
                        Course Description is required*
                    </span>)
                }
            </div>

            <div className='relative flex flex-col space-y-2'>
                <label className='text-sm text-[#F1F2FF]' htmlFor='coursePrice'>Course Price<sup className='text-[#EF476F]'>*</sup></label>
                <input
                    id='coursePrice'
                    placeholder='Enter Course Price'
                    {...register("coursePrice", {
                        required:true,
                        valueAsNumber:true
                    })}
                    className='rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full !pl-12'
                />
                <HiOutlineCurrencyRupee size={24}  className='absolute top-7 text-[#6E727F]'/>
                {
                    errors.coursePrice && (
                        <span className='ml-2 text-xs tracking-wide text-[#EF476F]'>Course Price is Required</span>
                    )
                }
            </div>

            <div className='flex flex-col space-y-2'>
                <label className='text-sm text-[#F1F2FF]' htmlFor='courseCategory'>Course Category<sup className='text-[#EF476F]'>*</sup></label>
                <select 
                    className='rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full'
                    id='courseCategory'
                    {...register("courseCategory", { required:true })}
                >
                    <option value="" disabled>Choose a Category</option>

                    {
                        !loading && courseCategories.map((category, index) => (
                            <option key={index} value={category._id}>
                                {category?.name}
                            </option>
                        ))
                    }

                </select>
                {errors.courseCategory && (
                    <span className='ml-2 text-xs tracking-wide text-[#EF476F]'>
                        Course Category is Required*
                    </span>
                )}
            </div>

            {/* custom component for handling tags input */}
            <ChipInput
                label="Tags"
                name="courseTags"
                placeholder="Enter tags and press enter"
                register={register}
                errors={errors}
                setValue={setValue}
                getValues = {getValues}
            />

            {/*component for uploading and showing preview of media */}
            <Upload
                name={"thumbnailImage"}
                label={"Course Thumbnail"}
                register={register}
                errors={errors}
                setValue={setValue}
            />
            
            {/*     Benefits of the Course */}
            <div className='flex flex-col space-y-2'>
                <label className='text-sm text-[#F1F2FF]'>Benefits of the course<sup className='text-[#EF476F]'>*</sup></label>
                <textarea
                    id='courseBenefits'
                    placeholder='Enter Benefits of the course'
                    {...register("courseBenefits", { required: true })}
                    className='rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none resize-x-none min-h-[130px] w-full'
                />
                {errors.courseBenefits && (
                    <span className='ml-2 text-xs tracking-wide text-[#EF476F]'>
                        Benefits of the course are required**
                    </span>
                )}
            </div>

            <RequirementField
                name="courseRequirements"
                label="Requirements/Instructions"
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
            />
            <div className='flex justify-end gap-x-2'>
                {
                    editCourse && (
                        <button
                        onClick={() => dispatch(setStep(2))}
                        className=' text-[10px] md:text-sm p-2 px-1 font-semibold rounded-md flex items-center gap-x-2 bg-[#838894]'
                        >
                            Continue Without Saving
                        </button>
                    )
                }
                <IconBtn type={"submit"}
                    text={!editCourse ? "Next" : "Save Changes"}
                    />
            </div>
        </form>
        </FormProvider>
    )
}

export {
    CourseInformationForm
}