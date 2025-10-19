import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function RequirementsField({
        name, 
        label, 
        register, 
        setValue, 
        errors,
        getValues
    }){
    const { editCourse, course } = useSelector((state) => state.course);
    const [requirements, setRequirements] = useState("");
    const [requirementsList, setRequirementsList] = useState([]);

        useEffect(() => {
            register(name, {
                required: true
            });
        }, []);

    useEffect(() => {
        setValue(name, requirementsList)
        if(editCourse){
            setRequirementsList(course?.instructions);
            setValue(name, course?.instructions);
        }
    }, [requirementsList]);

    const handleAddRequirement = () => {
        if(requirements){
            setRequirementsList([...requirementsList, requirements]);
        }
    }

    const handleRemoveRequirement = (index) => {
        const updatedRequirementsList = [...requirementsList]
        updatedRequirementsList.splice(index, 1)
        setRequirementsList(updatedRequirementsList)
    }

    return(
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-[#F1F2FF]" htmlFor={name}>
                {label} <sup className="text-red-600">*</sup>
            </label>
            <div className="flex flex-col items-start space-y-2">
                <input
                    type="text"
                    id={name}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full !pr-10"
                />
                <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="font-semibold text-[#FFD60A]"
                >
                    Add
                </button>
            </div>
            {requirementsList.length > 0 && (
                <ul className="mt-2 list-inside list-disc">
                    {
                        requirementsList.map((requirement, index) => (
                        <li key={index} className="flex items-center text-[#F1F2FF]">
                            <span>{requirement}</span>
                            <button 
                                type="button" 
                                className="ml-2 text-xs text-[#888888]" 
                                onClick={() => handleRemoveRequirement(index)}
                            >
                                Clear
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-red-600">
                    {label} is required
                </span>
            )}
        </div>
    )
}

export {
    RequirementsField
}