import React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { sendOtp } from "../../../services/operations/authAPI"
import { setSignupData } from "../../../slices/authSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { Tab } from "../../Common/Tab";

function SignupForm(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);
    const [formData, setFormDta] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
        const [showPassword, setShowPassword] = useState(false)
        const [showConfirmPassword, setShowConfirmPassword] = useState(false)
        const { firstName, lastName, email, password, confirmPassword} = formData

        const handleOnchange = (e) => {
            setFormDta((prevData) => ({
                ...prevData,
                [e.target.name]: e.target.value
            }))
        }

        const handleOnSubmit = (e) => {
            e.preventDefault()
            if(password !== confirmPassword){
                toast.error("Passwords do not match")
                return
            }

            const signupData = {
                ...formData,
                accountType
            }

            dispatch(setSignupData(signupData));
            dispatch(sendOtp(formData.email, navigate));

            setFormDta({
                firstName: "",
                lastName: "",
                email: "",
                password:"",
                confirmPassword: ""
            })

            setAccountType(ACCOUNT_TYPE.STUDENT)
        }

        const tabData = [
            {
                id: 1,
                tabName: "Student",
                type: ACCOUNT_TYPE.STUDENT
            },
            {
                id: 2,
                tabName: "Instructor",
                type: ACCOUNT_TYPE.INSTRUCTOR
            }
        ]

        return(
            <div>
                <Tab tabData={tabData} field={accountType} setField={setAccountType}/>
                <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
                    <div className="flex gap-x-4">
                        <label>
                            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                First Name <sup className="text-red-200">*</sup>
                            </p>
                            <input
                                required
                                type="text"
                                name= "firstName"
                                value={firstName}
                                placeholder="Enter first name"
                                onChange={handleOnchange}
                                className="form-style w-full"
                            />
                        </label>
                        <label>
                            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                Last Name <sup className="text-red-200">*</sup>
                            </p>
                            <input
                                required
                                type="text"
                                name="lastName"
                                value={lastName}
                                placeholder="Enter last name"
                                className="form-style w-full"
                            />
                        </label>
                        <label>
                            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                Email Address <sup className="text-red-300">*</sup>
                            </p>
                            <input
                                required
                                type="text"
                                name="email"
                                value={email}
                                placeholder="Enter Email Address"
                                className="form-style w-full"
                            />
                        </label>
                        <div className="flex gap-x-4">
                            <label className="relative">
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                    Create Password <sup className="text-red-200">*</sup>
                                </p>
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={handleOnchange}
                                    placeholder="Enter Password"
                                    className="form-style w-full !pr-10"
                                />
                                <span onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[38px] z-[10px] cursor-pointer">
                                    {showPassword ? (
                                        <AiOutlineEyeInvisible fontSize={24} fill="#AFB@BF"/>
                                    ): (
                                        <AiOutlineEye fontSize={24} fill="#AFB2BF"/>
                                    )}
                                </span>
                            </label>
                            <label className="relative">
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                    Confirm Password <sup className="text-red-200">*</sup>
                                </p>
                                <input
                                    required
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    placeholder="Confirm Password"
                                    className="form-style w-full !pr-10"
                                />
                                <span className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                    {showConfirmPassword ? (
                                        <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>
                                    ) : (
                                        <AiOutlineEye fontSize={24} fill="#AFB2BF"/>
                                    )}
                                </span>
                            </label>
                        </div>
                        <button type="submit" className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900">
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        )
}

export {
    SignupForm
}