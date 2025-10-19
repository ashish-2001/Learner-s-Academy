import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BuyCourse } from "../../../../services/operations/studentFeaturesAPI";
import { IconBtn } from "../../../Common/IconBtn";

function RenderTotalAmount(){
    const { total, cart } = useSelector((state) => state.cart);
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBuyCourse = () => {
        const courses = cart.map((course) => course._id);
        console.log("Bought these courses", courses);
        if(token){
            const courses = cart.map((course) => course._id);
            BuyCourse(token, courses, user, navigate, dispatch);
        }else{
            navigate('/login');
        }
    }

    return(
        <div className="min-w-[280px] rounded-md border-[1px] border-[#2C333F] bg-[#161D29] p-6">
            <p className="mb-1 text-sm font-medium text-[#838894]">Total:</p>
            <p className="mb-6 text-3xl font-medium text-[#E7C009]">Rs.{total}</p>
            <IconBtn
                text={"Buy Now"}
                onClick={handleBuyCourse}
                customClasses={"flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 w-full justify-center"}
            />
        </div>
    )
}

export {
    RenderTotalAmount
}