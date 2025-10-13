import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/operations/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";

function UpdatePassword(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { loading } = useSelector((state) => state.auth)
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    })

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { password, confirmPassword } = formData;

    function handleOnChange(e){
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }))
    } 

    function handleOnSubmit(e){
        e.preventDefault()
        const token = location.pathname.split("/").at(-1)
        dispatch(resetPassword(password, confirmPassword, token, navigate)) 
    }

    return(
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            {loading ? (
                <div className="spinner"></div>
            ) : (
                <div className="max-w-[500px] p-4 lg:p-8">
                    <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-[#F1F2FF]">
                        Choose new password
                    </h1>
                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-[#AFB2BF]">
                        Almost done. Enter your new password and your all set.
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        <label className="relative">
                            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#F1F2FF]">
                                New password <sup className="text-red-600">*</sup>
                            </p>
                            <input
                                required
                                name="password"
                                value={password}
                                onChange={handleOnChange}
                                placeholder="enter password"
                                className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full !pr-10"
                            />
                            <span onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                                {showPassword ? (
                                    <AiOutlineEyeInvisible fill="#AFB2BF" fontSize={24}/>
                                ) : (
                                    <AiOutlineEye fill="#AFB2BF" fontSize={24}/>
                                )}
                            </span>
                        </label>
                        <label className="relative mt-3 block" htmlFor="confirmPassword">
                            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#F1F2FF]">
                                Confirm New Password <sup className="text-red-600">*</sup>
                            </p>
                            <input
                                required
                                type={confirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleOnChange}
                                placeholder="Enter Confirm Password"
                                className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full !pr-10"
                            />
                            <span className="absolute right-3 top-[38px] z-[10] cursor-pointer" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                                {showConfirmPassword ? (
                                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>
                                ) : (
                                    <AiOutlineEye fontSize={24} fill="#AFB2BF"/>
                                )}
                            </span>
                        </label>
                        <button type="submit" className="mt-6 w-full rounded-[8px] bg-[#FFD60A] py-[12px] px-[12px] font-medium text-[#000814]">
                            Reset password
                        </button>
                    </form>
                    <div className="mt-6 flex items-center justify-between">
                        <Link to={"/login"}>
                            <p className="flex items-center gap-2 text-[#F1F2FF]">
                                <BiArrowBack/> Back to login
                            </p>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export {
    UpdatePassword
}