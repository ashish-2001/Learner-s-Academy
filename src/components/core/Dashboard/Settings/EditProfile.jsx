import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateProfile } from "../../../../services/operations/settingsAPI";
import { IconBtn } from "../../../Common/IconBtn";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "other"];

function EditProfile(){
    const { user} = useSelector((state)=> state.profile)
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { 
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            firstName:user?.firstName || "",
            lastName: user?.lastName || "",
            dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
            gender: user?.additionalDetails?.gender || "",
            contactNumber: user?.additionalDetails?.contactNumber || "",
            about: user?.additionalDetails?.about || ""
        }
    });

    const submitProfileForm = async (data) => {

        const profileData = {
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            contactNumber: data.contactNumber,
            about: data.about
        }
        try{
            console.log("Profile Data:", profileData)
            dispatch(UpdateProfile(token, profileData))
            console.log("This is after dispatch:", profileData)

        } catch(error){

            console.log("Error message", error.message)
        }
    }

    return(
        <>
            <form onSubmit={handleSubmit(submitProfileForm)}>
                <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-[#2C333F] bg-[#161D29] p-8 px-12">
                    <h2 className="text-lg font-semibold text-[#F1F2FF]">
                        Profile Information
                    </h2>
                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label>
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#F1F2FF]">
                                    First Name <sup className="text-red-600 text-[20px] top-1">*</sup>
                                </p>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                placeholder="Enter  first name"
                                className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[6E727F] focus:outline-none w-full"
                                {...register("firstName", { required : true})}
                                defaultValue={user?.firstName}
                            />
                            </label>
                            {errors.firstName && (
                                <span className="-mt-1 text-[12px] text-[#E7C009]">
                                    Please enter your first name
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label>
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#F1F2FF]">
                                    Last Name <sup className="text-red-600 text-[20px] top-1">*</sup>
                                </p>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                placeholder="Enter last name"
                                className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[6E727F] focus:outline-none w-full"
                                {...register("lastName", { required: true })}
                                defaultValue={user?.lastName}
                            />
                            </label>
                            {errors.lastName && (
                                <span className="-mt-1 text-[12px] text-[#E7C009]">
                                    Please enter your last name
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label>
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#F1F2FF]">
                                    Date Of Birth <sup className="text-red-600 text-[20px] top-1">*</sup>
                                </p>
                            <input
                                type="date"
                                name="dateOfBirth"
                                id="dateOfBirth"
                                className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[6E727F] focus:outline-none w-full"
                                {...register("dateOfBirth", {
                                    required :{
                                        value: true,
                                        message: "Please enter your date of birth"
                                    },
                                    max: {
                                        value: new Date().toISOString().split("T")[0],
                                        message: "Date of Birth cannot be in the future."
                                    }
                                })}
                                defaultValue={user?.additionalDetails?.dateOfBirth}
                            />
                            </label>
                            {errors.dateOfBirth && (
                                <span className="-mt-1 text-[12px] text-[#E7C009]">
                                    {errors.dateOfBirth.message}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label>
                            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#F1F2FF]">
                                Gender <sup className="text-red-600 text-[20px] top-1">*</sup>
                            </p>
                            <select
                                type="text"
                                name= "gender"
                                id="gender"
                                className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[6E727F] focus:outline-none w-full"
                                {...register("gender", { required: true})}
                                defaultValue={user?.additionalDetails?.gender}
                            >
                                {genders.map((ele, i)=> {
                                    return(
                                        <option key={i} value={ele}>
                                            {ele}
                                        </option>
                                    )
                                })}
                            </select>
                            </label>
                            {errors.gender && (
                                <span className="-mt-1 text-[12px] text-[#E7C009]">
                                    Please enter your date of birth
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label>
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#F1F2FF]">
                                    Contact Number <sup className="text-red-600 text-[20px] top-1">*</sup>
                                </p>
                            <input
                                type="tel"
                                name="contactNumber"
                                id="contactNumber"
                                placeholder="Enter Contact number"
                                className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[6E727F] focus:outline-none w-full"
                                {...register("contactNumber", {
                                    required:{ 
                                        value: true,
                                        message: "Please enter your contact number"
                                    },
                                    maxLength: { value: 12, message: "invalid Contact Number"},
                                    minLength: { value: 10, message: "Invalid Contact Number"}
                                })}
                                defaultValue={user?.additionalDetails?.contactNumber}
                            />
                            </label>
                            {errors.contactNumber && (
                                <span className="-mt-1 text-[12px] text-[#E7C009]">
                                    {errors.contactNumber.message}
                                </span>
                            )} 
                        </div>
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label>
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#F1F2FF]">
                                    Last Name <sup className="text-red-600 text-[20px] top-1">*</sup>
                                </p>
                            <input
                                type="text"
                                name="about"
                                id="about"
                                placeholder="Enter Bio Details"
                                className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[6E727F] focus:outline-none w-full"
                                {...register("about", { required: true })}
                                defaultValue={user?.additionalDetails?.about}
                            />
                            </label>
                            {errors.about && (
                                <span className="-mt-1 text-[12px] text-[#E7C009]">Please Enter your bio</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => {
                            navigate("/dashboard/my-profile")
                        }}
                        className="cursor-pointer rounded-md bg-[#2C333F] py-2 px-5 font-semibold text-[#C5C7D4]"
                    >
                        Cancel
                    </button>
                    <IconBtn type={"submit"} text={"Save"}/>
                </div>
            </form>
        </>
    )
}


export {
    EditProfile
}