import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../../../services/operations/SettingsAPI";
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
    } = useForm();

    const submitProfileForm = async(data) => {
        try{
            dispatch(updateProfile(token, data))
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
                            <label htmlFor="firstName" className="label-style">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                placeholder="Enter  first name"
                                className="form-style "
                                {...register("firstName", { required : true})}
                                defaultValue={user?.firstName}
                            />
                            {errors.firstName && (
                                <span className="-mt-1 text-[12px] text-[#E7C009]">
                                    Please enter your first name
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="lastName" className="label-style">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                placeholder="Enter last name"
                                className="form-style "
                                {...register("lastName", { required: true })}
                                defaultValue={user?.lastName}
                            />
                            {errors.lastName && (
                                <span className="-mt-1 text-[12px] text-[#E7C009]">
                                    Please enter your last name
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="dateOfBirth" className="label-style">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                id="dateOfBirth"
                                className="form-style "
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
                            {errors.dateOfBirth && (
                                <span className="-mt-1 text-[12px] text-[#E7C009]">
                                    {errors.dateOfBirth.message}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="gender" className="label-style">
                                Gender
                            </label>
                            <select
                                type="text"
                                name= "gender"
                                id="gender"
                                className="form-style "
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
                            {errors.gender && (
                                <span className="-mt-1 text-[12px] text-[#E7C009]">
                                    Please enter your date of birth
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="contactNumber" className="label-style">
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                name="contactNumber"
                                id="contactNumber"
                                placeholder="Enter Contact number"
                                className="form-style "
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
                            {errors.contactNumber && (
                                <span className="-mt-1 text-[12px] text-[#E7C009]">
                                    {errors.contactNumber.message}
                                </span>
                            )} 
                        </div>
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="about" className="label-style">
                                About
                            </label>
                            <input
                                type="text"
                                name="about"
                                id="about"
                                placeholder="Enter Bio Details"
                                className="form-style py-2 px-3 border-2 border-blue-950 hover:border-blue-950 hover:border-2"
                                {...register("about", { required: true })}
                                defaultValue={user?.additionalDetails?.about}
                            />
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