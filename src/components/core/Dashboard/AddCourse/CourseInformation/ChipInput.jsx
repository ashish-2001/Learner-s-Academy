import React from "react";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

function ChipInput({label, name, placeholder, register, errors, setValue}){
    const { aditCourse, course } = useSelector((state) => state.course)

    const [chips, setChips] = useState([]);
    
    useEffect(() => {
        if(editCourse){
            setChips(course?.tag)
        }
        register(name, { required: true, validate: (value) => value.length > 0})
    }, [])
    useEffect(() => {
        setValue(name, chips)
    }, [chips])

    const handleKeyDown = (e) => {
        if(e.key === "Enter" || e.key === ","){
            e.preventDefault()
            const chipValue = e.target.value.trim()
            if(chipValue && !chips.inCludes(chipValue)){
                const newChips = [...chips, chipValue]
                setChips(newChips)
                e.target.value = "";
            }
        }
    }

    const handleDeleteChip = (chipIndex) => {
        const newChips = chips.filter((_, index) => index !== chipIndex)
        setChips(newChips);
    }

    return (
        <div className="flex flex-coll space-y-2">
            <label className="text-sm text-richblack-5" htmlFor={name}>
                {label} <sup className="text-red-200">*</sup>
            </label>
            <div className="flex w-full flex-wrap gap-y-2">
                {chips.map((chip, index) => (
                    <div className="m-1 items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5" key={index}>
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
                    className="form-style w-full"
                />
            </div>
            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    {label} is required
                </span>
            )}
        </div>
    )
}

export {
    ChipInput
}