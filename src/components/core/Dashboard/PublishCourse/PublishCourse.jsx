import React from 'react'
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setCourse, setEditCourse, setStep } from '../../../../slices/courseSlice';
import { COURSE_STATUS } from '../../../../utils/constants.js';
import { addCourseCategory, editCourseDetails } from '../../../../services/operations/courseDetailsAPI';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PublishCourse = () => {

    const { token } = useSelector((state) => state.auth);
    const { course } = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register, 
        handleSubmit, 
        setValue, 
        getValues
    } = useForm();

    useEffect(() => {
        if(course?.status === COURSE_STATUS.PUBLISHED) {
            setValue("public", true);
        }
    },[course, setValue]);

    const goBack = () => {
        dispatch(setStep(2));
    }

    const goToMyCourses = () => {
        navigate("/dashboard/my-courses");
    }

    const handelPublish = async () => {
        if((course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) || ( course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)) {
            goToMyCourses();
            setLoading(false);
            dispatch(setStep(1));
            dispatch(setEditCourse(null));
            return;
        }

        const formData = new FormData();
        formData.append("courseId", course._id);
        formData.append("status", getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT);

        const result = await editCourseDetails(formData, token);
        const category_id= await course.category;
        const categoryResult = await addCourseCategory({ categoryId: category_id, courseId: course._id }, token);

        if(result && categoryResult) {
            goToMyCourses();
            dispatch(setStep(1));
            dispatch(setEditCourse(null));
        } else {
            toast.error("Something went wrong");
        }
        setLoading(false);
    }
        

    const onSubmit = (data) => {
        setLoading(true);
        handelPublish(data);
    }

return (
    <div>
        <div className='rounded-md border-[1px] border-[#2C333F] bg-[#161D29] p-6'>
            <p className='text-2xl font-semibold text-[#F1F2FF]'>Publish Settings</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='my-6 mb-8'>
                    <label htmlFor="public" className="inline-flex items-center text-lg">
                        <input defaultChecked={false} type="checkbox" id="public" name="public" className="border-gray-300 h-4 w-4 rounded bg-[#585D69] text-[#6E727F] focus:ring-2 focus:ring-[#F1F2FF]" {...register("public")} />
                        <span className="ml-2 text-[#6E727F]">Make this course as public</span>
                    </label>
                </div>
                <div className="ml-auto flex max-w-max items-center gap-x-4">
                    <button disabled={loading} onClick={goBack} type="button" className="flex cursor-pointer items-center gap-x-2 rounded-md bg-[#838894] py-[8px] px-[20px] font-semibold text-[#000814]">Back</button>
                    <button disabled={loading} type='submit' className="flex items-center bg-[#FFD60A] cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-[#000814]">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
)
}

export {
    PublishCourse
}