import React from "react";
import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operations/authAPI";

function ForgotPassword(){
    const [email, setEmail] = useState();
    const [emailSent, setEmailSent] = useState(false);
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);

    function handleSubmit(e){
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent))
    }

    return(
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            {loading ? (
                <div className="spinner"></div>
            ) : (
                <div className="max-w-[500px] p-4 lg:p-8">
                    <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-[#F1F2FF]">
                        {!emailSent ? "Reset your password" : "Check Email"}
                    </h1>
                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-[#AFB2BF]">
                        {!emailSent ? "Have no fear. We'll email you instructions to reset your password. If you don't have access to your email we can try account recovery" : `We have sent the reset email to ${email}`}
                    </p>
                    <form onSubmit={handleSubmit}>
                        {!emailSent && (
                            <label className="w-full">
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#F1F2FF]">
                                    Email Address <sup className="text-red-600">*</sup>
                                </p>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    className="form-style w-full py-2 px-3 border-2 border-blue-950 hover:border-2 hover:border-blue-950"
                                />
                            </label>
                        )}
                        <button
                            type="submit"
                            className="mt-6 w-full rounded-[8px] bg-[#FFD60A] py-[12px] px-[12px] font-medium text-[#000814]"
                        >
                            {!emailSent ? "Submit" : "Resend Email"}
                        </button>
                    </form>
                    <div className="mt-6 flex items-center justify-between">
                        <Link to={"/login"}>
                            <p className="flex items-center gap-x-2 text-[#F1F2FF]">
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
    ForgotPassword
}