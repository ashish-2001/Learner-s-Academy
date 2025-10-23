import React from "react";
import { FaStar } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactStars from "react-rating-stars-component";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../../../slices/cartSlice";
import { Link } from "react-router-dom";

function RenderCartCourses(){
    const { cart } = useSelector((state) => state.cart)
    const dispatch = useDispatch();
    return(
        <div className="flex flex-1 flex-col">
            {cart.map((course, index) => (
                <div className={`flex w-full flex-wrap items-start justify-between gap-6 border-b border-b-[#6E727F] pb-6 false pt-6`} key={course._id}>
                    <div className="flex flex-1 flex-col gap-4 xl:flex-row">
                        <Link>
                            <img
                                src={course?.thumbnail}
                                alt={course?.courseName}
                                className="md:h-[148px] md:w-[220px] rounded-lg h-[100px] w-[180px] object-cover"
                            />
                        </Link>
                        <div className="flex flex-col space-y-1">
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
                            <div className="flex items-center gap-2">
                                <span className="text-[#FFF970]"></span>
                                <ReactStars
                                    count={5}
                                    value={course?.ratingAndReviews?.length}
                                    size={20}
                                    edit={false}
                                    activeColor={"#ffd700"}
                                    emptyIcon={<FaStar/>}
                                    fullIcon={<FaStar/>}
                                />
                                <span className="text-[#6E727F]">
                                    {course?.ratingAndReviews?.length} Ratings
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                        <p className="mb-6 text-2xl md:text-3xl font-medium text-[#B69507]">Rs.{course?.price}</p>
                        <button 
                            onClick={() => dispatch(removeFromCart(course._id))} 
                            className="flex items-center gap-x-1 rounded-md border border-[#424854] bg-[#2C333F] py-3 px-[12px] text-[#841E3E]"
                        >
                            <RiDeleteBin6Line/>
                            <span></span>
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