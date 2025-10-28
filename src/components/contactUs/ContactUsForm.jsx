import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { apiConnector } from '../../services/apiConnector';
import { contactUsEndpoint } from '../../services/apis';
import { toast } from 'react-hot-toast';
import { CountryCode } from '../../data/CountryCode';

const ContactUsForm = () => {

    const [loading, setLoading] = useState(false);

    const { 
        register,
        handleSubmit,
        reset,
        formState:{
            errors,
            isSubmitSuccessful
        }} = useForm();

    useEffect(() => {
        if(isSubmitSuccessful){
            reset({
                firstName:"",
                lastName:"",
                email:"",
                message:"",
                contactNumber:""
            })
        }
    }, [reset, isSubmitSuccessful])

    const onSubmit = async (data) => {
        console.log(data);
        try{
        setLoading(true);
        const contactNumber = data.countryCode+" "+data.contactNumber;
        const countryCode = data.countryCode
        const payload = { 
            firstName: data.firstName, 
            lastName: data.lastName, 
            email: data.email, 
            message: data.message, 
            contactNumber, 
            countryCode
        }

        const res = await apiConnector("POST", contactUsEndpoint.CONTACT_US_API, payload);

        if(res.data.success === true){
            toast.success("Message sent successfully");
        }
        else{
            toast.error("Failed to send message");
        }
        }catch(error){
            console.log(error);
            toast.error("Failed to send message");
            setLoading(false)
        } finally{
            setLoading(false);
            reset();
        }
    }
    
return (
    loading ? (<div className=".custom-loader w-[100%] pt-[30%] pb-[30%]"><div className="custom-loader"></div></div>):(
    <div>
        <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-7"}>

        <div className="flex flex-col gap-5 lg:flex-row"><div className="flex flex-col gap-2 lg:w-[48%]"><label htmlFor="firstName" className="text-[14px] text-[#F1F2FF]">First Name</label><input type="text" name="firstName" id="firstName" placeholder="Enter first name"
        {...register("firstName",{required:true})} className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-[#fff]/50 placeholder:text-[#6E727F] focus:outline-none"/>
        {
            errors.firstName && <span className=" text-[#FFE83D]">Enter First Name *</span>
        }</div>

        <div className="flex flex-col gap-2 lg:w-[48%]"><label htmlFor="lastName" className="text-[14px] text-[#F1F2FF]">Last Name</label><input type="text" name="lastName" id="lastName" placeholder="Enter last name" className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-[#fff]/50 placeholder:text-[#6E727F] focus:outline-none"  {...register("lastName")}/>
        {
            errors.lastName && <span className=" text-[#FFE83D]">Enter LastName</span>
        }</div></div>
        
        <div className="flex flex-col gap-2"><label htmlFor="email" className="text-[14px] text-[#F1F2FF]">Email Address</label><input type="email" name="email" id="email" placeholder="Enter email address" className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-[#fff]/50 placeholder:text-[#6E727F] focus:outline-none"  {...register("email",{required:true})}/>
        {
            errors.email && <span className=" text-[#FFE83D]">Enter Email *</span>
        }</div>
        
        <div className='flex flex-col gap-2'>
            <label htmlFor="contactNumber" className="text-[14px] text-[#F1F2FF]">Contact Number</label>
            <div className='flex gap-5'>
                <div className='flex w-[81px] flex-col gap-2'>
                <select type="text" name="countryCode" id="countryCode" className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text- shadow-[0_1px_0_0] shadow-[#fff]/50 placeholder:text-[#6E727F] focus:outline-none" {...register("countryCode", { required:true })}>
                    {
                        CountryCode.map((item, index)=>{
                            return(
                                <option key={index} value={item.code}>
                                    {item.code} - {item.country}
                                </option>
                            )
                        })
                    }
                </select>
                </div>
                <div className='flex w-[calc(100%-90px)] flex-col gap-2'>
                <input 
                    type="tel" 
                    name="contactNumber" 
                    id="contactNumber" 
                    placeholder="12345 67890" 
                    className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-[#fff]/50 placeholder:text-[#6E727F] focus:outline-none" 
                    {...register("contactNumber", { 
                        required: "Please enter contact Number", 
                        maxLength: { value: 12, message:"Enter a valid contact Number" }, 
                        minLength:{ value: 8, message: "Enter a valid Phone Number"}})} />
                {
                    errors.contactNumber && <span className=" text-[#FFE83D]">{errors.contactNumber.message}</span>
                }
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-2"><label htmlFor="message" className="text-[14px] text-[#F1F2FF]">Message</label><textarea name="message" id="message" cols="30" rows="7" placeholder="Enter your message here" className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-[#fff]/50 placeholder:text-[#6E727F] focus:outline-none"  {...register("message",{required:true})}/>
        {
            errors.message && <span className=" text-[#FFE83D]">Enter your message *</span>
        }</div>

        <button type="submit" className="rounded-md bg-[#FFD60A] px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-95 hover:shadow-none  disabled:bg-[#585D69] sm:text-[16px]">Send Message</button>

        </form>
    </div>
    )
)
}

export {
    ContactUsForm
}