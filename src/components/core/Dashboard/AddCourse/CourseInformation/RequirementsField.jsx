import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function RequirementsField({
        name, 
        label, 
        register, 
        setValue, 
        errors
    }){
    const { editCourse, course } = useSelector((state) => state.course);
    const [requirements, setRequirements] = useState("");
    const [requirementsList, setRequirementsList] = useState([]);

    useEffect(() => {
        if(editCourse){
            setRequirementsList(course?.instructions);
        }
        register(name, { required: true, validate: (value) => value.length > 0})
    }, [])

    useEffect(() => {
        setValue(name, requirementsList)
    }, [requirementsList])

    const handleAddRequirement = () => {
        if(requirements){
            setRequirementsList([...requirementsList, requirements])
            setRequirements("");
        }
    }

    const handleRemoveRequirement = (index) => {
        const updatedRequirements = [...requirementsList]
        updatedRequirements.splice(index, 1)
        setRequirementsList(updatedRequirements)
    }

    return(
        <div className="flex flex-col space-y-2">
            <label className="text-sm textwhite" htmlFor={name}>
                {label} <sup className="text-red-600">*</sup>
            </label>
            <div className="flex flex-col items-start space-y-2">
                <input
                    type="text"
                    id={name}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="form-style w-full py-2 px-3 border-2 border-blue-950 hover:border-blue-950 hover:border-2"
                />
                <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="font-semibold text-yellow-600"
                >
                    Add
                </button>
            </div>
            {requirementsList.length > 0 && (
                <ul className="mt-2 list-inside list-disc">
                    {requirements.localeCompare((requirement, index) => (
                        <li key={index} className="flex items-center text-white">
                            <span>{requirement}</span>
                            <button type="button" className="ml-2 text-xs text-gray-300" onClick={() => handleRemoveRequirement(index)}>
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