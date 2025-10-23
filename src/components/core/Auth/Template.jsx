import React from "react";
import { useSelector } from "react-redux";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { frame } from "../../../assets/images/index";

function Template({ title, description1, description2, image, formType }){
    const { loading } = useSelector((state) => state.auth);

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh - 3.5rem)] place-items-center">
            {loading ? (
                <div className="spinner"></div>
            ) : (
                <div className="mx-auto flex w-11/12 max-w-1260px flex-col-reverse justify-center items-center gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12">
                    <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
                        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-white">
                            {title}
                        </h1>
                        <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
                            <span className="text-[#AFB2BF]">{description1}</span> {" "}
                            <span className="font-edu-sa font-bold italic text-[#47A5C5]">
                                {description2}
                            </span>
                        </p>
                        {formType === "signup" ? <SignupForm/> : <LoginForm/>}
                    </div>
                    <div>
                        <img
                            src={frame}
                            alt="Pattern"
                            width={558}
                            height={504}
                            loading="lazy"
                        />
                        <img
                            src={image}
                            alt="Students"
                            width={558}
                            height={504}
                            loading="lazy"
                            className="absolute -top-4 right-4 z-10"
                        />
                    </div>
                </div>
            )}
        </div>
    )

}

export {
    Template
}