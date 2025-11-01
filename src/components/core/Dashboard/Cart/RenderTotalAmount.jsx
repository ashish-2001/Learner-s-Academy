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
        <div className=" flex flex-col items-center justify-center min-w-[280px] rounded-md border-[1px] border-[#2C333F] bg-[#161D29] p-3 mb-8">
            <div className="flex items-center justify-center gap-3">
                <p className="mb-3 text-2xl font-medium text-[#838894]">Total:</p>
                <p className="mb-3 text-2xl font-medium text-[#E7C009]">₹ {total}</p>
            </div>
            <IconBtn
                text={"Buy Now"}
                onClick={handleBuyCourse}
                ClassName={"flex items-center w-full bg-[#FFD60A] cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-[#000814] justify-center"}
            />
        </div>
    )
}

export {
    RenderTotalAmount
}