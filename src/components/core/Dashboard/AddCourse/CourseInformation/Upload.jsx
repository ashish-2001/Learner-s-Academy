import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Upload = ({ name, label, register, errors, setValue }) => {
    const [image, setImage] = useState(null);
    const { editCourse, course } = useSelector((state) => state.course) ;
    
    const handleOnChange = (e) => {
        const file = e.target.files[0];
        setValue(name, e.target.files[0]);
        if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            }
            reader.readAsDataURL(file);
        }
    }

    useEffect(() => {
        if(editCourse){
            setImage(course?.thumbnail);
        }
    }, []);

    return (
        <div>
            {
                image ? (
                    <div>
                        <img src={image} alt="" className="h-full w-full rounded-md object-cover"/>
                        <button type="button" onClick={() => { setImage(null); setValue(name, null)}} className="text-sm">Remove</button>
                    </div>
                ) : (
                    <div className="flex flex-col space-y-2">
                        <label htmlFor={label}>
                            <div>
                                Course Thumbnail <sup className="text-red-600">*</sup>
                            </div>
                            <div className="flex min-h-[250px] cursor-pointer items-center rounded-md border-2 border-dotted">
                                <div 
                                    className="flex w-full flex-col items-center p-6"
                                    role="presentation"
                                    tabIndex={0}
                                >
                                    <input
                                        id={label}
                                        name={name}
                                        type="file"
                                        accept="image/*,.jpeg,.jpg,.png"
                                        multiple=""
                                        {...register(name, { required: true })}
                                        onChange={handleOnChange}
                                        className="hidden"
                                    />
                                    <div className="grid aspect-square w-14 place-items-center rounded-full">
                                        <svg
                                            stroke="currentColor"
                                            fill="none"
                                            strokeWidth={"2"}
                                            viewBox="0 0 24 24"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-2xl"
                                            height={"1em"}
                                            width={"1em"}
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <polyline points="16 16 12 12 8 16"></polyline>
                                            <line x1={"12"} y1={"12"} x2={"12"} y2={"21"}></line>
                                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                                            <polyline points="16 16 12 12 8 16"></polyline>
                                        </svg>
                                    </div>
                                    <p className="mt-2 max-w-[200px] text-center text-sm">
                                        Drag and drop an image, or click to{" "}
                                        <span className="font-semibold ">Browse</span> a file
                                    </p>
                                    <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs">
                                        <li>Aspect ration 16:9</li>
                                        <li>Recommended size 1024*576</li>
                                    </ul>
                                </div>
                            </div>
                        </label>
                        {
                            errors.courseImage && (
                                <span className="ml-2 text-xs tracking-wide text-red-600">
                                    Course image is required
                                </span>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export {
    Upload
}