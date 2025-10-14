import React from "react";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

function ChipInput({
        label, 
        name, 
        placeholder, 
        register, 
        errors, 
        setValue
    }){

    const { editCourse, course } = useSelector((state) => state.course)

    const [chips, setChips] = useState([]);
    
    useEffect(() => {
        if(editCourse){
            setChips(course?.tag || [])
        }
        if(register && typeof register === "function"){
            register(name, { required: true, validate: (value) => value.length > 0 });
        }
    }, [editCourse, course, register, name])

    useEffect(() => {
        if(setValue && typeof setValue === "function"){
            setValue(name, chips);
        }
    }, [chips, setValue, name]);

    const handleKeyDown = (e) => {
        if(e.key === "Enter" || e.key === ","){
            e.preventDefault()
            const chipValue = e.target.value.trim()
            if(chipValue && !chips.includes(chipValue)){
                
                setChips([...chips, chipValue]);
                
                e.target.value = "";

            }
        }
    }

    const handleDeleteChip = (chipIndex) => {

        setChips(chips.filter((_, index) => index !== chipIndex))
        
    }

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-[#F1F2FF]" htmlFor={name}>
                {label} <sup className="text-red-600">*</sup>
            </label>
            <div className="flex w-full flex-wrap gap-y-2">
                {chips.map((chip, index) => (
                    <div className="m-1 items-center rounded-full bg-[#9E8006] px-2 py-1 text-sm text-[#F1F2FF]" key={index}>
                        {chip}
                        <button className="ml-2 focus:outline-none" onClick={() => handleDeleteChip(index)}>
                            <MdClose className="text-sm"/>
                        </button>
                    </div>
                ))}
                <input 
                    id={name}
                    name={name}
                    type="text"
                    placeholder={placeholder}
                    onKeyDown={handleKeyDown}
                    className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none !pr-10 w-full py-2 px-3 border-2 border-blue-950 hover:border-blue-950 hover:border-2"
                />
            </div>
            {errors && errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-red-600">
                    {label} is required
                </span>
            )}
        </div>
    )
}

export {
    ChipInput
}