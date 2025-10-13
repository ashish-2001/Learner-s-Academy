import React from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import { CourseBuilderForm } from "./CourseBuilder/CourseBuilderForm";
import { CourseInformationForm } from "./CourseInformation/CourseInformationForm";
import { PublishCourse } from "./PublishCourse";

function RenderSteps(){
    const { step } = useSelector((state) => state.course);

    const steps = [
        {
            id:1,
            title:"Course Information"
        },
        {
            id:2,
            title:"Course Builder"
        },
        {
            id:3,
            title:"Publish"
        }
    ]

    return(
        <>
            <div className="relative mb-2 flex w-full justify-center">
                {steps.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <div className="flex flex-col items-center">
                            <button className={`grid cursor-default aspect-square w-[34px] item-center rounded-full border-[1px] ${
                                step === item.id 
                                ? "border-[#FFD60A] bg-[#251400] text-[#838894]"
                                : "border-[#2C333F] bg-[#161D29] text-[#838894]"
                            } ${step > item.id && "bg-[#FFD60A] text-[#FFD60A]"}`}>
                                {step > item.id ? (
                                    <FaCheck className="font-bold text-[#000814]"/>
                                ) : (
                                    item.id
                                )}
                            </button>
                        </div>
                        {index !== steps.length - 1 && (
                            <>
                                <div className={`h-[calc(34px/2)] w-[33%] border-dashed border-b-2 ${
                                    step > item.id ? "border-[#FFD60A]" : "border-[#585D69]"
                                }`}></div>
                            </>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="relative mb-16 flex w-fu;; select-none justify-between">
                {steps.map((item) => {
                    <>
                        <div className="flex min-w-[130px] flex-col items-center gap-y-2" key={item.id}>
                            <p className={`text-sm ${
                                step >= item.id ? "text-[#F1F2FF]" : "text-[#585D69]"
                            }`}>
                                {item.title}
                            </p>
                        </div>
                    </>
                })}
            </div>
            {step === 1 && <CourseInformationForm/>}
            {step === 2 && <CourseBuilderForm/>}
            {step === 3 && <PublishCourse/>}
        </>
    )
}

export {
    RenderSteps
}