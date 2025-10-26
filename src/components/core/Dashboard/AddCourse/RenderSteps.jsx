import React from 'react'
import { FaCheck } from 'react-icons/fa';
import { useSelector } from 'react-redux'
import { CourseBuilderForm } from './CourseBuilder/CourseBuilderForm';
import { CourseInformationForm } from './CourseInformation/CourseInformation';
import { PublishCourse } from '../PublishCourse/PublishCourse';

const RenderSteps = () => {

    const { step } = useSelector((state)=> state.course);

    const steps = [
        {
            id: 1,
            title: "Course Information",
        },
        {
            id: 2,
            title: "Course Builder",
        },
        {
            id: 3,     
            title: "Publishing Course",
        },
    ]

return (
    <>
    <div className=' flex justify-center items-center'>
    <div className=' flex flex-col w-[calc(100vw-20%)] md:w-fit items-start'>
        <div className=' ml-10 relative mb-2 flex w-full justify-center'>
            {steps.map( (item) => (
                <div key={item.id} className=' flex w-full justify-between'>
                    <div className='flex flex-col items-center'>
                        <div className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] ${
                        step === item.id 
                            ? "bg-[#251400] border-[#FFD60A] text-[#FFD60A]" 
                            : step > item.id
                            ? "border-[#2C333F] bg-[#161D29] text-[#838894]"
                            : "bg-[#161D29] border-[#2C333F] text-[#838894]"
                        }`}>
                            { step > item.id ? <FaCheck/> : item.id }
                        </div>
                    </div>
                    { item.id < steps.length - 1 && (
                    <div className={`h-[calc(34px/2)] w-[100%]  border-dashed border-b-2 ${
                    step > item.id 
                    ? "border-[#FFD60A]" 
                    : "border-[#2C333F]"
                    }`}></div>
                    )}
                </div>
            ) )}
        </div>
        <div className='relative mb-16 flex w-full select-none justify-between'>
            {steps.map((item) => (
                <div key={item.id} className='flex md:min-w-[180px] flex-col items-start'>
                    <p className=' ml-3 md:ml-0 text-[10px] md:text-sm text-[#F1F2FF]'>{item.title}</p>
                </div>
            ))}
        </div>
        </div>
    </div>

        {step === 1 && <CourseInformationForm />}
        {step === 2 && <CourseBuilderForm/>}
        {step === 3 && <PublishCourse/>}
    </>
)
}

export {
    RenderSteps
}