import React from "react";
import { FaStar } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactStars from "react-stars";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../../../slices/cartSlice";
import { Link } from "react-router-dom";

function RenderCartCourses(){

    const { cart } = useSelector((state) => state.cart)
    const dispatch = useDispatch();

    return(
        <div className="flex flex-col lg:flex-row gap-10 w-full">
            {cart.map((course, index) => (
                <div className={`flex flex-col w-full  items-start justify-between gap-6 border-b border-b-[#6E727F] pb-6 false pt-6`} key={index}>
                    <div className="flex flex-col gap-4 w-full">
                        <Link to={`/courses/${course._id}`} >
                            <img
                                src={course?.thumbnailImage}
                                alt={course?.courseName}
                                className="md:h-[148px] md:w-[220px] lg:w-full lg:h-[200px] rounded-lg h-[100px] w-full object-cover "
                            />
                        </Link>
                        <div className="flex flex-col space-y-1 w-[300px] text-start">
                            <Link to={`/courses/${course._id}`}>
                                <p className="text-lg font-medium text-[#F1F2FF]">
                                    {course?.courseName}
                                </p>
                            </Link>
                            <Link to={`/catalog/${course?.category?.name}`}>
                                <p className="text-sm text-[#838894]">
                                    {course?.category?.name}
                                </p>
                            </Link>
                            <div className="flex translate-x-[-10px] items-center gap-2">
                                <span className="text-[#FFF970]"></span>
                                    <ReactStars
                                        count={5}
                                        size={20}
                                        edit={false}
                                        activeColor={"#ffd700"}
                                        emptyIcon={<FaStar/>}
                                        fullIcon={<FaStar/>}
                                    />
                                <span className=" flex text-start text-[#6E727F]">
                                    {course?.ratingAndReviews?.length} Ratings
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-between space-y-2">
                        <p className="mb-6 lg:text-2xl md:text-3xl font-medium text-[#B69507]">Rs.{course?.price}</p>
                        <button 
                            onClick={() => dispatch(removeFromCart(course._id))} 
                            className="flex items-center translate-y-[-10px] gap-x-1 rounded-md border border-[#424854] py-2 px-2 text-red-600 cursor-pointer"
                        >
                            <RiDeleteBin6Line className="text-2xl"/>
                            
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}


export {
    RenderCartCourses
}