import React from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { changePassword } from "../../../../services/operations/SettingsAPI";
import { IconBtn } from "../../../Common/IconBtn";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";

function UpdatePassword(){
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const submitPasswordForm = async(data) => {
        try{
            await changePassword(token, data);
        } catch(error){
            console.log("Error message-", error.message)
        }
    }

    return(
        <>
            <form onSubmit={handleSubmit(submitPasswordForm)}>
                <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-[#2C333F] bg-[#161D29] p-8 px-12">
                    <h2 className="text-lg font-semibold text-[#F1F2FF]">Password</h2>
                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="relative flex flex-col gap-2 lg:w-[48%]">
                            <label>
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#F1F2FF]">
                                    Current Password <sup className="text-red-600 text-[20px] top-1">*</sup>
                                </p>
                            <input
                                type={showOldPassword ? "text" : "password"}
                                name="oldPassword"
                                id="oldPassword"
                                placeholder="Enter Current Password"
                                className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[6E727F] focus:outline-none w-full"
                                {...register("oldPassword", { required: true})}
                            />
                            <span onClick={() => setShowOldPassword((prev) => !prev)} className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                                {showOldPassword ? (
                                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>
                                ) : (
                                    <AiOutlineEye fontSize={24} fill="#AFB2BF"/>
                                )}
                            </span>
                            </label>
                            {errors.oldPassword && (
                                <span className="-mt-1 text-[12px] text-[#E7C009]">
                                    Please enter your current password
                                </span>
                            )}
                        </div>
                        <div className="relative flex flex-col gap-2 lg:w-[48%]">
                            <label>
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#F1F2FF]">
                                    New Password <sup className="text-red-600 text-[20px] top-1">*</sup>
                                </p>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                name="newPassword"
                                id="newPassword"
                                placeholder="Enter new password"
                                className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[6E727F] focus:outline-none w-full"
                                {...register("newPassword", { required: true})}
                            />
                            </label>
                            <span onClick={()=> setShowNewPassword((prev) => !prev)} className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                                {showNewPassword ? (
                                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>
                                ) : (
                                    <AiOutlineEye fontSize={24} fill="#AFB2BF"/>
                                )}
                            </span>
                            {errors.newPassword && (
                                <span className="-mt-1 text-[12px] text-[#E7C009]">
                                    Please enter your new password.
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            navigate("/dashboard/my-profile")
                        }}
                        className="cursor-pointer rounded-md bg-[#2C333F] py-2 px-5 font-semibold text-[#DBDDEA]"
                    >
                        Cancel
                    </button>
                    <IconBtn
                        type={"submit"}
                        text={"Update"}
                    />
                </div>
            </form>
        </>
    )
}

export {
    UpdatePassword
}