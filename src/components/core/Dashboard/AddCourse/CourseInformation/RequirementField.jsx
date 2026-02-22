import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';


const RequirementField = ({ name, label }) => {
    const [requirement, setRequirement] = useState("");
    const [requirementList, setRequirementList] = useState([]);
    const {editCourse, course} = useSelector((state) => state.course);

    const {
        register,
        setValue,
        formState: { errors }
    } = useFormContext();

    useEffect(()=> {
        register(name, {
            required: true,
        });
    },[register, name]);

    useEffect(()=> {
        if(editCourse && course?.instructions?.length > 0) {
            setRequirementList(course?.instructions);
            setValue(name, course?.instructions);
        };
    },[ editCourse, course?.instructions, name, setValue]);

    useEffect(() => {
        setValue(name, requirementList);
    }, [requirementList, name, setValue]);

    const handleAddRequirement = () => {
        if(requirement.trim()) {
            setRequirementList((prev) => [...prev, requirement.trim()]);
            setRequirement("");
        };
    };

    const handleRemoveRequirement = (index) => {
        const updatedRequirementList = [...requirementList];
        updatedRequirementList.splice(index, 1);
        setRequirementList(updatedRequirementList);
    };

return (
        <div className=''>
            <label className='text-sm text-[#F1F2FF]' htmlFor={name}>{label}<sup className='text-[#EF476F]'>*</sup></label>
            <div>
                <input
                    type='text'
                    id={name}
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    placeholder='Enter requirement'
                    className='rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full'
                />
                <button
                    type='button'
                    onClick={handleAddRequirement}
                    className='font-semibold text-[#FFD60A] mt-3'
                >
                    Add
                </button>
            </div>

            {
                requirementList.length > 0 && (
                    <ul className='mt-2 list-inside list-disc'>
                        {
                            requirementList.map((requirement, index) => (
                                <li key={index} className='flex items-center text-[#F1F2FF]'>
                                    <span>{requirement}</span>
                                    <button
                                        type='button'
                                        onClick={() => handleRemoveRequirement(index)}
                                        className='ml-2 text-xs text-[#888888] '
                                    >
                                        clear
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                )
            }
            {errors[name] && (
                <span className='ml-2 text-xs tracking-wide text-[#EF476F]'>
                    {label} is required
                </span>
            )}
        </div>
    );
};

export {
    RequirementField
};