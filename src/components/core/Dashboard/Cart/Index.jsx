import React from "react";
import { useSelector } from "react-redux";
import { RenderCartCourses } from "./RenderCartCourses";
import { RenderTotalAmount } from "./RenderTotalAmount";

function Cart(){
    
    const { total, totalItems } = useSelector((state) => state.cart);

    return (
        <div className="mx-auto max-w-[1265px] flex flex-col items-center justify-center">
            <h1 className=" text-3xl font-medium text-[#F1F2FF]">Cart</h1>
            <p className="border-b w-full border-b-[#6E727F] font-semibold text-[#6E727F] flex items-center justify-center">
                {totalItems >= 2 ? `${totalItems} Courses in Cart` : `${totalItems} Course in cart`} 
            </p>
            {total > 0 ? (
                <div className="flex flex-row justify-center items-center gap-x-10 gap-y-6 lg:flex ">
                    <RenderCartCourses/>
                    <RenderTotalAmount/>
                </div>
            ) : (
                <p className="mt-14 text-center text-3xl text-[#AFB2BF]">Your Cart is empty</p>
            )}
        </div>
    );
};

export {
    Cart
};