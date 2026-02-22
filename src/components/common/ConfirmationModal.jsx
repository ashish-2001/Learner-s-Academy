import React from "react";
import { IconBtn } from "./IconBtn";

function ConfirmationModalData({ modalData }){

    return(
        <div>
            <div className="w-11/12 max-w-[350px] rounded-lg border border-[#6E727F] bg-[#161D29] p-6 fixed inset-0 z[1000] !mt-0 grid place-items-center overflow-auto bg-opacity-10 backdrop-blur-sm">
                <p className="text-2xl font-semibold text-[#F1F2FF]">
                    {modalData?.text1}
                </p>
                <p className="mt-3 mb-5 leading-6 text-[#999DAA]">
                    {modalData?.text2}
                </p>
                <div className="flex-items-center gap-x-4">
                    <IconBtn 
                        className='flex items-center bg-[#999DAA] cursor-pointer gap-x-2 rounded-md py-2 text-sm md:text-lg px-3 md:px-5 font-semibold text-[#000814] undefined'
                        onClick={modalData?.btn1Handler }
                        text={modalData?.btn1Text }
                    />
                    <IconBtn  
                        className='flex items-center bg-[#999DAA] cursor-pointer gap-x-2 rounded-md py-2 text-sm md:text-lg px-3 md:px-5 font-semibold text-[#000814] undefined' 
                        onClick={modalData?.btn2Handler} 
                        text={modalData?.btn2Text}
                    />
                </div>
            </div>
            <div className="fixed inset-0 z-10 !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm over"></div>
        </div>
    )
};

export {
    ConfirmationModalData
};