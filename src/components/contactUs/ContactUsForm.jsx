import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../services/apiConnector";
import { contactUsEndpoint } from "../../services/apis";
import toast from "react-hot-toast";
import { CountryCode } from "../../data/CountryCode";

function ContactUsForm(){
    const [loading, setLoading] = useState(false);
    const {
        register, 
        handleSubmit, 
        reset, 
        formState: { 
            errors, 
            isSubmitSuccessful
        }
    } = useForm();

    useEffect(() => {
        if(isSubmitSuccessful){
            reset({
                firstName:"",
                lastName: "",
                email: "",
                message: "",
                phoneNumber: ""
            });
        }
    }, [reset, isSubmitSuccessful]);

    const onSubmit = async (data) => {
        console.log(data);
        try{
            setLoading(true);
            const phoneNumber = data.countryCode+" "+data.phoneNumber;
            const { firstName, lastName, email, message } = data;
            const res = await apiConnector("POST", contactUsEndpoint.CONTACT_US_API, {
                firstName,
                lastName,
                email, 
                message,
                phoneNumber
            });

            if(res.data.success === true){
                toast.success("Message sent successfully");
            }
            else{
                toast.error("Something went wrong");
            }
            console.log("Contact response", res);
            setLoading(false);
        } catch(error){
            console.log("Error", error);
        }
    }

    return (
        loading ? (<div className=".custom-loader w-[100%] pt-[30%] pb-[30%]">
            <div className="custom-loader"></div>
        </div>) : (
            <div>
                <form 
                    onSubmit={handleSubmit(onSubmit)}
                    className={"flex flex-col gap-7"}
                >
                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="flex flex-col gap-2 lg:w-[48%]">
                            <label 
                                htmlFor="firstName"
                                className="label-style"
                            >
                                First Name
                            </label>
                            <input
                                type="text" 
                                name="firstName"
                                id="firstName"
                                placeholder="Enter first name"
                                {...register("firstName", { required: true })}
                                className="form-style"
                            />
                            {errors.firstName && 
                                <span className="tex-yellow-25">
                                    Enter First Name
                                </span>
                            }
                        </div>
                        <div>
                            <label 
                                htmlFor="lastName"
                                className="label-style"
                            >
                                Last Name
                            </label>
                            <input
                                type="text" 
                                name="lastName"
                                placeholder="Enter last name"
                                className="form-style"
                                {...register("lastName", { required: true })}
                            />
                            {
                                errors.lastName && <span className="text-yellow-25">
                                    Enter last name
                                </span>
                            }
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="label-style">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter Email Address"
                            className="form-style"
                            {...register("email", { required: true})}
                        />
                        {
                            errors.email && (
                                <span className="text-yellwo-25">Enter Email</span>
                            )
                        }
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="phoneNumber" className="label-style">
                            Phone Number
                        </label>
                        <div className="flex gap-5">
                            <div className="flex w-[81px] flex-col gap-2">
                                <select 
                                    type="text"
                                    name="countryCode"
                                    id="countryCode"
                                    className="form-style"
                                    {...register("countryCode", { required: true})}
                                >
                                    {
                                        CountryCode.map((item, index) => (
                                            <option key={index} value={item.code}>
                                                {item.code} - {item.country}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="flex w-[calc(100px - 90px)] flex-col gap-2">
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    placeholder="12345 67890"
                                    className="form-style"
                                    {...register("phoneNumber", { required: { value: true, message: "Please enter phone number"}, maxLength:{ value: 10, message: "Enter a valid phone number"}, minLength: { value:8, message: "Enter a valid phone number"}})}
                                />
                                {
                                    errors.phoneNumber && <span className="text-yellow-25">{errors.phoneNumber.message}</span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="message" className="label-style">Message</label>
                        <textarea
                            name="message"
                            id="message"
                            cols={"30"}
                            rows={"7"}
                            placeholder="Enter your message here"
                            className="form-style"
                            {...register("message", { required: true })}
                        />
                        {errors.message && <span className="text-yellow-25">Enter Your message</span>}
                    </div>
                    <button type="submit" className="rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-95 hover:shadow-none  disabled:bg-richblack-500 sm:text-[16px] ">
                        Send Message
                    </button>
                </form>
            </div>
        )
    )
}

export {
    ContactUsForm
}