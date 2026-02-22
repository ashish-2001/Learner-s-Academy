import React from "react";
import { HighLightText } from "../../../components/core/HomePage/HighLightText";
import { CTAButton } from "../../../components/core//HomePage/Button";

const LearningGridArray = [
    {
        order: -1,
        heading: "World-Class Learning for",
        highlightText: "Anyone, Anywhere",
        description: "Learners Academy partners with more than 275+ universities",
        BtnText: "Learn More",
        BtnLink: "/"
    },
    {
        order: 1,
        heading: "Curriculum Based on Industry Needs",
        description: "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs."
    },
    {
        order: 2,
        heading: "Our Learning Methods",
        description:
            "Learners Academy partners with more than 275+ leading universities and companies to bring",
    },
    {
        order: 3,
        heading: "Certification",
        description:
        "Learners Academy partners with more than 275+ leading universities and companies to bring",
    },
    {
        order: 4,
        heading: "Rating 'Auto-grading'",
        description:
        "Learners Academy partners with more than 275+ leading universities and companies to bring",
    },
    {
        order: 5,
        heading: "Ready to Work",
        description:
        "Learners Academy partners with more than 275+ leading universities and companies to bring",
    }
];


function LearningGrid(){
    return(
        <div className="grid mx-auto w-[350px] xl:w-fit grid-cols-1 xl:grid-cols-4 mb-12">
            {LearningGridArray.map((card, index) => {
                return (
                    <div className={`${index === 0 && "lg:col-span-2 lg:h-[294px] p-5"} ${ card.order % 2 === 1 ? "bg-[#2C333F] lg:h-[294px] p-5" : "bg-[#161D29] lg:h-[294px] p-5"} ${ card.order === 3 && "lg:col-start-2"} ${card.order < 0 && "bg-[#ffff00]"}`} key={index}> 
                            { card.order < 0 ? (
                            <div className="xl:w-[90%] flex flex-col gap-3 pb-10 xl:pb-0">
                                <div className="text-4xl font-semibold">
                                    {card.heading}
                                    <HighLightText text={card.highlightText}/>
                                </div>
                                <p className="text-[#838894] font-medium">
                                    {card.description}
                                </p>
                                <div className="w-fit mt-2">
                                    <CTAButton active={true} linkTo={card.BtnLink}>
                                        {card.BtnText}
                                    </CTAButton>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 flex-col gap-8">
                                <h1 className="text-[#F1F2FF] text-lg">{card.heading}</h1>
                                <p className="text-[#838894] font-medium">
                                    {card.description}
                                </p>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    );
};


export {
    LearningGrid
};