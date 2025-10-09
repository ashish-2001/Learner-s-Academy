import React from "react";
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

function CourseCard({cardData, currentCard, setCurrentCard}){
    return(
        <div className={`w-[369px] lg:w-[30%] ${
            currentCard === cardData?.heading ? "bg-white shadow-[12px_12px_0_0] shadow-[#FFD60A]" : "bg-[#161D29]"
        } text-[#DBDDEA] h-[300px] box-border cursor-pointer`} onClick={() => setCurrentCard(cardData?.heading)}>
            <div className="border-b-[2px] border-[#6E727F] border-dashed h-[80%] p-6 flex flex-col gap-3">
                <div className={`${
                    currentCard === cardData?.heading && "text-[#161D29]"
                } font-semibold text-[20px]`}>
                    {cardData?.heading}
                </div>
                <div className="text-[#161D29]">
                    {cardData?.description}
                </div>
                <div className={`flex justify-between ${
                    currentCard === cardData?.heading ? "text-[#0F7A9D]" : "text-[#838894]"
                } px-6 py-3 font-medium`}>
                    <div className="flex items-center gap-2 text-[16px]">
                        <HiUsers/>
                        <p>{cardData?.level}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[16px]">
                        <ImTree/>
                        <p>{cardData?.lessonNumber} Lesson</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {
    CourseCard
}