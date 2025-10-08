import React from "react";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { BsFillCaretRightFill } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../../slices/cartSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants";


function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }){
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        thumbnail: ThumbnailImage,
        price: CurrentPrice,
        _id: courseId
    } = course;

    function handleShare(){
        copy(window.location.href)
        toast.success("Link copied to clipboard")
    }
    
    function handleAddToCart(){
        if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR){
            toast.error("You are an instructor you can't buy a course.")
            return
        }

        if(token){
            dispatch(addToCart(course));
            return ;
        }
        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to add to cart",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null)
        })
    }

    return(
        <>
            <div className="flex flex-col gap-4 rounded-md bg-[#2C333F] p-4 text-[#F1F2FF]">
                <img
                    src={ThumbnailImage}
                    alt={course?.courseName}
                    className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
                />
                <div className="px-4">
                    <div className="space-x-3 pb-4 text-3xl font-semibold">
                        Rs. {CurrentPrice}
                    </div>
                    <div className="flex flex-col gap-4">
                        <button className="cursor-pointer rounded-md bg-[#FFD60A] px-[20px] py-[8px] font-semibold text-[#000814]" onClick={ user && course?.studentsEnrolled.includes(user?._id)
                            ? () => navigate("/dashboard/enrolled-courses")
                            : handleBuyCourse
                        }>
                            {user && course?.studentsEnrolled.includes(user?._id) 
                            ? "Go to course"
                            : "Buy Now"}
                        </button>
                        {(!user || !course?.studentsEnrolled.includes(user?._id)) && (
                            <button onClick={handleAddToCart} className="cursor-pointer rounded-md bg-[#161D29] px-[20px] py-[8px] font-semibold text-[#F1F2FF]">
                                Add to cart
                            </button>
                        )}
                    </div>
                    <div>
                        <p className="pb-3 pt-6 text-center text-sm text-[#DBDDEA]">
                            30-Day Money back guarantee
                        </p>
                    </div>
                    <div className={''}>
                        <p className={'my-2 text-xl font-semibold'}>
                            This course includes: 
                        </p>
                        <div className="flex flex-col gap-3 text-sm text-[#06D6A0]">
                            {course?.instructions?.map((item, i)=> {
                                return (
                                    <p className="flex gap-2" key={i}>
                                        <BsFillCaretRightFill/>
                                        <span>{item}</span>
                                    </p>
                                )
                            })}
                        </div>
                    </div>
                    <div className="text-center">
                        <button onClick={handleShare} className="mx-auto flex items-center gap-2 py-6 text-[#E7C009]">
                            <FaShareSquare size={15}/> Share
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}


export {
    CourseDetailsCard
}