import { useEffect, useState } from "react"

const ContactUsForm = () =>{
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { error, isSubmitSuccessful },
    } = useForm();

    const submitContactForm = async (data) =>{

        try{
            setLoading(true)
            const res = await apiConnector(
                "Post",
                contactUsEndpoint.CONTACT_US_API,
                data
            )
            setLoading(false)
        }
        catch(error){
            console.log("ERROR MESSAGE - ", error.message)
            setLoading(false)
        }
    }

    useEffect(() =>{
        if(isSubmitSuccessful){
            reset({
                email: "",
                firsName:"",
                lastName:"",
                message:"",
                phoneNo:""
            })
        }
    }, [reset, isSubmitSuccessful])

    return(
        <form 
            className="flex flex-col gap-7"
            onSubmit={handleSubmit(submitContactForm)}
        >
            <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="firstName" className="label-style">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="Enter First Name"
                        className="form-style"
                        {...register("firstName", {required: true})}
                    />
                    {errors.firsName && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please Enter Your Name.
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="lastName" className="label-style">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Enter YOur Last Name"
                        className="form-style"
                        {...register("lastName")}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label className="label-style" htmlFor="email">
                    Email Address
                </label>
                <input 
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Your Email"
                    className="form-style"
                    {...register("Email", { required: true})}
                />
                {errors.email && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        Please enter your email address.
                    </span>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="phoneNumber" className="label-style">
                    Phone Number
                </label>
                <div className="flex gap-2">
                    <div className="flex w-[81px] flex-col gap-2">
                        <select 
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="Enter Your First Name"
                            className="form-style"
                            {...register("countryCode", { required: true})}
                        >
                            {countryCode.map((ele, i) =>{
                                return(
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
                            name="phoneNumber"
                            id="phoneNumber"
                            placeholder="12345 67890"
                            className="form-style"
                            {...register("phoneNo.", { 
                                required:{ 
                                    value: true, 
                                    message: "Please Enter Your Phone Number."
                                },
                                maxLength: { value:12, message:"Invalid Phone Number"},
                                minLength: { value:10, message: "Invalid Phone Number"}
                            })}
                        />
                    </div>
                </div>
                {errors.phoneNo && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        {errors.phoneNo.message}
                    </span>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <label className="label-style" htmlFor="message">
                    Message
                </label>
                <textarea
                    name="message"
                    id="message"
                    cols={30}
                    rows={7}
                    placeholder="Enter Your Message"
                    className="form-style"
                    {...register("message",{ required: true})}/>
                    {errors.message && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please Enter Your Message.
                        </span>
                    )}
            </div>
            <button
                disabled={loading}
                type="submit"
                className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px-2px-0px-0px-rgba(255, 255, 255, 0.18)] ${
                    !loading && "transition-all duration-200 hover:scale-95 hover:shadow-none"
                }`}
            >
                Send Message
            </button>
        </form>
    )
}

export default ContactUsForm