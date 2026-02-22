import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ChipInput = ({ name, label, register, errors, setValue }) => {
    const [tags, setTags] = useState([]);
    const {editCourse, course} = useSelector((state) => state.course);

    

    useEffect(()=> {
        register(name, {
            required:true,
            // validate: (value) => value.length > 0
        });
        if(editCourse ) {
            try{
                const parsedTags = Array.isArray(course?.tag)
                ? course.tag
                : JSON.parse(course?.tag || "[]");

                setTags(parsedTags);
                setValue(name, parsedTags);
            } catch(error){
                toast.error("Invalid tag format", error.message);
                setTags([]);
                setValue(name, []);
            };
        };
    }, []);

return (
        <div>
            <label className='text-sm text-[#F1F2FF]' htmlFor={name}>{label}<sup className='text-[#EF476F]'>*</sup></label>
            <div className='flex flex-wrap gap-2 m-2'>
                {
                    tags.map((tag, index) => (
                        <div key={index} className='m-1 flex items-center rounded-full bg-[#9E8006] px-2 py-1 text-sm text-[#F1F2FF]'>
                            <span className='text-[#F1F2FF]'>{tag}</span>
                            <button
                                type='button'
                                onClick={() => {
                                    const updatedTags = [...tags];
                                    updatedTags.splice(index, 1);
                                    setTags(updatedTags);
                                    setValue(name, updatedTags);
                                }}
                                className='ml-2 text-[#F1F2FF]'
                            >
                                <FaTimes/>
                            </button>
                            </div>
                    ))
                }
        </div>
        <input
            type='text'
            id={name}
            placeholder='Press Enter or , to add a tag'
            className='rounded-lg bg- p-3 text-[16px] leading-[24px] text-[#F1F2FF] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[#6E727F] focus:outline-none w-full'
            onKeyDown={(e) => {
                if(e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    if(e.target.value) {
                        setTags([...tags, e.target.value]);
                        setValue(name, [...tags, e.target.value]);
                        e.target.value = "";
                    }
                }
            }}
        />
        {
            errors[name] && <span className='text-xs text-[#EF476F]'>Tags are required</span>
            
        }
        </div>
    );
};

export {
    ChipInput
};