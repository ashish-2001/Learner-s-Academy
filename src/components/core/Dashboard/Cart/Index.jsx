import React from "react";
import { useSelector } from "react-redux";
import { RenderCartCourses } from "./RenderCartCourses";
import { RenderTotalAmount } from "./RenderTotalAmount";

function Cart(){
    const { total, totalItems } = useSelector((state) => state.cart);
    const { paymentLoading } = useSelector((state) => state.course);

    if(paymentLoading){
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
            <>
                <h1 className="mb-14 text3xl font-medium text-blue-950">Cart</h1>
                <p className="border-b border-b-blue-950 pb-2 font-semibold textwhite">
                    {totalItems} Courses in Cart
                </p>
                {total > 0 ? (
                    <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
                        <RenderCartCourses/>
                        <RenderTotalAmount/>
                    </div>
                ) : (
                    <p className="mt-14 text-center text-3xl text-blue-950">Your Cart is empty</p>
                )}
            </>
        )
}

export {
    Cart
}