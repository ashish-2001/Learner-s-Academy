import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CountryCode } from "../../../data/CountryCode";
import { contactUsEndpoint } from "../../../services/apis";
import { apiConnector } from "../../../services/apiConnector";

function ContactUsForm(){

    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful}
    } = useForm();

    const submitContactForm = async (data) => {
        try{
            setLoading(true)
            await apiConnector(
                "POST",
                contactUsEndpoint.CONTACT_US_API,
                data
            )

            setLoading(false)
        }
        catch(e){
            console.log("ERROR MESSAGE:- ", e.message)
            setLoading(false);
        }
    }

    useEffect(() => {
        if(isSubmitSuccessful){
            reset({
                email: "",
                firstName: "",
                lastName: "",
                message: "",
                phoneNo: ""
            })
        }
    }, [reset, isSubmitSuccessful]);

    return(
        <form className="flex flex-col gap-7" onSubmit={handleSubmit(submitContactForm)}>
            <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="firstName" className="text-[14px] text-[#F1F2FF]">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="Enter first name"
                        className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full !pr-10 "
                        {...register("firstName", { required: true})}
                    />
                    {errors.firstName && (
                        <span className="-mt-1 text-[12px] text-red-600">
                            Please enter your name
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label className="text-[14px] text-[#F1F2FF]" htmlFor="lastName">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Enter last name"
                        className=" rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full !pr-10"
                        {...register("lastName", {required: true})}
                    />
                    {errors.lastName && (
                        <span className="-mt-1 text-[12px] text-red-600">
                            Enter your last name
                        </span>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[14px] text-[#F1F2FF]">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter email address"
                    className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full !pr-10"
                    {...register("email", { required: true})}
                />
                {errors.email && (
                    <span className="-mt-1 text-[12px] text-red-600">
                        Please enter your email address.
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="phoneNumber" className="text-[14px] text-[#F1F2FF]">
                    Phone Number
                </label>

                <div className="flex gap-5">
                    <div className="flex w-[81px] flex-col gap-2">
                        <select 
                            type="text"
                            name="countryCode"
                            id="countryCode"
                            placeholder="Enter first name"
                            className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full !pr-10"
                            {...register("countryCode", { required: true})}
                        >
                            {CountryCode.map((ele, i) => {
                                return (
                                    <option key={i} value={ele.code}>
                                        {ele.code} -{ele.country}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                        <input
                            type="number"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="12345 67890"
                            className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full !pr-10"
                            {...register("phoneNumber", {
                                required: {
                                    value: true,
                                    message: "Please enter your phone number."
                                },
                                maxLength: { value: 12, message: "Invalid Phone Number"},
                                minLength: { value: 10, message: "Invalid Phone Number"}
                            })}
                        />
                    </div>
                </div>
                {errors.phoneNumber && (
                    <span className="-mt-1 text-[12px] text-red-600">
                        {errors.phoneNumber.message}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[14px] text-[#F1F2FF]">
                    Message
                </label>
                <textarea
                    name="message"
                    id="message"
                    cols={30}
                    rows={7}
                    placeholder="Enter your message"
                    className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full !pr-10"
                    {...register("message", { required: true})}
                />
                {errors.message && (
                    <span className="-mt-1 text-[12px] text-red-600">
                        Please enter your message
                    </span>
                )}
            </div>

            <button 
                disabled={loading}
                type="submit"
                className={`rounded-md bg-[#FFD60A] px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]
                    ${
                        !loading && "transition-all duration-200 hover:scale-95 hover:shadow-none"
                    } disabled:bg-[#585D69] sm:text-[16px]`}
            > Send Message</button>
        </form>
    )
}

export {
    ContactUsForm
}