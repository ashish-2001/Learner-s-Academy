import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { resetPassword } from '../services/operations/authAPI'
import { useDispatch } from 'react-redux'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import toast from 'react-hot-toast'

const ResetPassword = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const token = location.pathname.split("/").at(-1);
    const navigate = useNavigate();

    const { loading } = useSelector((state) => state.auth)
    const [resetComplete, setResetComplete] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
        const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const { password, confirmPassword } = formData;
        if (password === confirmPassword) {
            toast.error("Password do not match");
            return;
        }
        
        dispatch(resetPassword(password, confirmPassword, token, setResetComplete));

    };

    if(resetComplete){
        setTimeout(() => navigate("/login"), 2000);
    }

    const handleOnChange = (e) => {
        setFormData((formData) => ({ ...formData, [e.target.name] : e.target.value }));
        };

return (
    <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
            { loading ? (
                <div className="">Loading...</div>
                ) : (
                <div className='max-w-[500px] p-4 lg:p-8 '>
                    <h1 className='text-[1.875rem] font-semibold leading-[2.375rem] text-[#F1F2FF]'>
                        {
                            !resetComplete?("Choose new password") : "Reset complete!"
                        }
                    </h1>
                    <p className='my-4 text-[1.125rem] leading-[1.625rem] text-[#AFB2BF]'>
                        {
                            !resetComplete
                            ? "Almost done. Enter your new password and you are all set." 
                            : `All done! Redirecting to login...`
                        }
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        { !resetComplete && (
                                <>
                                <div className='relative mt-4'>
                                    <label className="w-full mb-1 block text-sm text-[#F1F2FF]">New Password 
                                        <sup className="text-[#EF476F]">*</sup>
                                    <input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        name ="password"
                                        value = {formData.password}
                                        onChange = {handleOnChange}
                                        placeholder = "Enter New Password"
                                        style={{
                                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                        }}
                                        className="w-full rounded-[0.5rem] bg-[#161D29] p-[12px] pr-12 text-[#F1F2FF]"
                                    /></label>
                                    <span
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-9 z-[10] cursor-pointer"
                                        >
                                        {   showPassword 
                                            ? <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" color="white" className='' />
                                            :  <AiOutlineEye fontSize={24} fill="#AFB2BF" color="white" />
                                        }
                                    </span>
                                </div>
                                <div className=' relative mt-4'>
                                    <label className="w-full"><p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#F1F2FF]">Confirm New Password <sup className="text-[#EF476F]">*</sup></p>
                                    <input
                                        required
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleOnChange}
                                        placeholder="Enter confirm Password"
                                        style={{
                                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                        }}
                                        className="w-full rounded-[0.5rem] bg-[#161D29] p-[12px] pr-12 text-[#F1F2FF]"
                                    /></label>
                                    <span
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute right-3 top-10 z-[10] cursor-pointer"
                                    >
                                        {showConfirmPassword ? (
                                            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" color="white"/>
                                        ) : (
                                            <AiOutlineEye fontSize={24} fill="#AFB2BF" color="white" />
                                        )}
                                        </span>
                                </div>
                                </>
                            )
                        }
                        <button 
                            type='submit'
                            disabled={loading}
                            className='mt-6 w-full rounded-[8px] bg-[#FFD60A] py-[12px] px-[12px] font-medium text-[#000814]'
                        >   {
                            resetComplete
                            ? "Redirecting..."
                            : loading
                            ? "Resetting..."
                            : "Reset Password"
                        }
                            Reset Password
                        </button>
                    </form> 

                    {
                        !resetComplete && (
                            <div className='mt-6 flex items-center justify-between'>
                                <Link to={"/login"}>
                                    <p className="flex items-center gap-x-2 text-[#F1F2FF]">
                                        <svg 
                                            stroke="currentColor" 
                                            fill="currentColor" 
                                            strokeWidth="0" 
                                            viewBox="0 0 24 24" 
                                            height="1em" 
                                            width="1em" 
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z"></path>
                                        </svg>
                                            Back To Login
                                    </p>
                                </Link>
                            </div>
                        )
                    }
                </div>
                )
            }
    </div>
)
}

export {
    ResetPassword
}