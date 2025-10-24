import React, { useEffect } from 'react';
import OTPInput from 'react-otp-input'
import { useSelector,useDispatch } from 'react-redux';
import { signUp } from '../services/operations/authAPI';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {

    const [otp, setOtp] = React.useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loading,signupData}= useSelector((state)=>state.auth);


    useEffect(() => {

        if(!signupData){
            navigate('/signup');
        }},[])



    const handleOnSubmit = (e) => {

        e.preventDefault();

        const otpString = otp.toString().trim();

        if(otpString.length !== 6){
            alert("Please enter the 6-digit otp");
            return;
        }

        const {email,accountType,confirmPassword,password,lastName,firstName}=signupData;

        dispatch(signUp(
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otpString,
            navigate
        ));
    }

return (
    loading?(<div className=" h-[100vh] flex justify-center items-center"><div className="custom-loader"></div></div>):(
    <div>
        <div className='min-h-[calc(100vh-3.5rem)] grid place-items-center'>
        <div className='max-w-[500px] p-4 lg:p-8'>
        <h1 className="text-[#F1F2FF] font-semibold text-[1.875rem] leading-[2.375rem]">Verify Email</h1>
        <p className="text-[1.125rem] leading-[1.625rem] my-4 text-[#AFB2BF]">A verification code has been sent to you. Enter the code below</p>
        <form onSubmit={handleOnSubmit}>
                <OTPInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    inputStyle={{
                        width:"40px",
                        height:"50px",
                        borderRadius: "8px",
                        border:"1px solid #585D69",
                        color: "white",
                        fontSize: "2rem",
                        backgroundColor: "#2C333F"
                    }}
                    focusStyle="border-[5px] border-red-500"
                    isInputNum={true}
                    shouldAutoFocus={true}
                    containerStyle="flex justify-between gap-4"
                    renderInput={(props) => <input {...props} />}
                    className={"text-white"}
                    />
                <button type="submit" className="w-full bg-[#FFD60A] py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-[#000814]">Verify Email</button>
                </form>
        </div>
        </div>
    </div>)
  )
}

export {
    VerifyOtp
}