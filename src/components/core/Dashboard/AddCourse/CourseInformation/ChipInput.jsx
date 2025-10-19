import React from "react";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

function ChipInput({
        label, 
        name,
        register, 
        errors, 
        setValue
    }){
        
        const [tags, setTags] = useState([]);
        const { editCourse, course } = useSelector((state) => state.course);
    
    useEffect(() => {
        register(name, {
            required: true
        });
        if(editCourse){
            setTags(JSON.parse(course?.tag));
            setValue(name, JSON.parse(course?.tag))
        }
    }, []);

    const handleKeyDown = (e) => {
        if(e.key === "Enter" || e.key === ","){
            e.preventDefault();

            const chipValue = e.target.value.trim();

            if(chipValue && !tags.includes(chipValue)){
                
                const newChips = [...tags, chipValue];
                setTags(newChips);
                e.target.value = "";
            }
        }
    }

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-[#F1F2FF]" htmlFor={name}>
                {label} <sup className="text-red-600">*</sup>
            </label>
            <div className="flex w-full flex-wrap gap-y-2">
                {tags.map((tag, index) => (
                    <div className="m-1 items-center rounded-full bg-[#9E8006] px-2 py-1 text-sm text-[#F1F2FF]" key={index}>
                        <span>{tag}</span>
                        <button 
                            type="button"
                            className="ml-2 focus:outline-none" 
                            onClick={() => {
                                const updatedTags = [...tags];
                                updatedTags.splice(index, 1);
                                setTags(updatedTags);
                                setValue(name, updatedTags);
                                } 
                            }
                        >
                            <FaTimes/>
                        </button>
                    </div>
                ))}
                <input 
                    id={name}
                    name={name}
                    type="text"
                    placeholder="Please enter or, to add a tag"
                    onKeyDown={handleKeyDown}
                    className="rounded-lg bg-[#2C333F] p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none !pr-10 w-full py-2 px-3 border-2 border-blue-950 hover:border-blue-950 hover:border-2"
                />
            </div>
            {errors[name] && (
                <span className="ml-2 text-xs tracking-wide text-red-600">
                    Tags is required
                </span>
            )}
        </div>
    )
}

export {
    ChipInput
}