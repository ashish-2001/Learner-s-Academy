import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import { ReactStars } from "react-rating-stars-component";
import { useSelector } from "react-redux";
import { createRating } from "../../../services/operations/courseDetailsAPI";
import { IconBtn } from "../../Common/IconBtn";

function CourseReviewModal({ setReviewModal }){
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth) ;
    const { courseEntireData } = useSelector((state) => state.viewCourse);

    const {
        register, 
        handleSubmit,
        setValue,
        formSate: { errors }
    } = useForm()

    useEffect(() => {
        setValue("courseExperience", "")
        setValue("courseRating", 0)
    }, [])

    function ratingChanged(newRating){
        setValue("courseRating", newRating)
    }

    const onSubmit = async(data) => {
        await createRating(
            {
                courseId: courseEntireData._id,
                rating: data.courseRating,
                review: data.courseExperience
            },
            token
        )
        setReviewModal(false)
    }

    return(
        <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
            <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-[#6E727F] bg-[#6E727F]">
                <div className="flex items-center justify-between rounded-t-lg bg-[#2C333F] p-5">
                    <p className="text-xl font-semibold text-[#F1F2FF]">Add Review</p>
                    <button onClick={() => setReviewModal(false)}>
                        <RxCross2 className="text-2xl text-[#F1F2FF]"/>
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-center gap-x-4">
                        <img
                            src={user?.image}
                            alt={user?.firstName + "profile"}
                            className="aspect-square w-[50px] rounded-full object-cover"
                        />
                        <div>
                            <p className="font-semibold text-[#F1F2FF]">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-sm text-[#F1F2FF]">Posting Publicly</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col items-center">
                        <ReactStars
                            count={5}
                            onChange={ratingChanged}
                            size={24}
                            activeColor="#ffd700"
                        />
                        <div className="flex w-11/12 flex-col space-y-2">
                            <label className="text-sm text-[#F1F2FF]" htmlFor="courseExperience">
                                Add your experience <sup className="text-red-600">*</sup>
                            </label>
                            <textarea
                                id="courseExperience"
                                placeholder="Add your experience"
                                {...register("courseExperience", { required: true})}
                                className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full !pr-10 resize-x-none min-h-[130px] w-full"
                            />
                            {errors.courseExperience && (
                                <span className="ml-2 text-xs tracking-wide text-red-600">
                                    Please Add Your Experience
                                </span>
                            )}
                        </div>
                        <div className="mt-6 flex w-11/12 justify-end gap-x-2">
                            <button className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-[#838894] py-[8px] px-[20px] font-semibold text-white`}>
                                Cancel
                            </button>
                            <IconBtn text={"Save"}/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export {
    CourseReviewModal
}