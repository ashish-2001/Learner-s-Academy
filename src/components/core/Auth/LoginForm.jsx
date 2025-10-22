import React from "react";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../services/operations/authAPI";
import { setProgress } from "../../../slices/loadingBarSlice";


function LoginForm(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [showPassword, setShowPassword] = useState(false);

    const { email, password } = formData;

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        dispatch(login(email, password, navigate))
    }

    return (
        <form onSubmit={handleOnSubmit} className="mt-6 flex w-full flex-col gap-y-4 ">
            <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#F1F2FF]">
                    Email Address <sup className="text-red-600 text-[20px] top-1">*</sup>
                </p>
                <input
                    required
                    type="text"
                    name="email"
                    value={email}
                    onChange={handleOnChange}
                    placeholder="Enter email address"
                    className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full"
                />
            </label>
            <label className="relative">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#F1F2FF]">
                    Password <sup className="text-red-600 text-[20px] top-1">*</sup>
                </p>
                <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    name="password"
                    value={password}
                    className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full "
                    onChange={handleOnChange}
                />
                <span onClick={() =>  setShowPassword((prev) => !prev)} className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                    {showPassword ? (
                        <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>
                    ) : (
                        <AiOutlineEye fontSize={24} fill="AFB2BF"/>
                    )}
                </span>
                <Link to="/forgot-password">
                    <p className="mt-1 ml-auto max-w-max text-xs text-[#47A5C5]">
                        Forgot Password
                    </p>
                </Link>
            </label>
            <button 
                type="submit" 
                className="mt-6 rounded-[8px] bg-[#FFD60A] py-[8px] px-[12px] font-medium text-[#000814]"
                onClick={dispatch(setProgress(60))}
            >
                Sign in
            </button>
        </form>
    )
}


export {
    LoginForm
}