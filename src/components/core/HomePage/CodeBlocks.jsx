import React from "react";
import { CTAButton } from "./Button";
import { FaArrowRight } from "react-icons/fa";
import { HtmlAnimation } from "../../../utils/CodeAnimation";


function CodeBlocks({ 
    position, 
    heading, 
    subHeading, 
    ctaBtn1, 
    ctaBtn2, 
    codeBlock, 
    backgroundGradient 
}){
    return(
        <div className={`flex ${position} my-20 justify-between flex flex-col lg:gap-10 gap-10`}>
            <div className="w-[100%] lg:w-[50%] flex flex-col gap-8">
                {heading}
                <div className="text-[#838894] text-base font-bold w-[85%] -mt-3">
                    {subHeading}
                </div>
                <div className="flex gap-7 mt-7">
                    <CTAButton active={ctaBtn1.active} linkTo={ctaBtn1.link}>
                        <div className="flex items-center gap-2">
                            {ctaBtn1.btnText}
                            <FaArrowRight/>
                        </div>
                    </CTAButton>
                    <CTAButton active={ctaBtn2.active} linkTo={ctaBtn2.link}>
                        {ctaBtn2.btnText}
                    </CTAButton>
                </div>
            </div>
            <div className="h-fit code-border flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px]">
                {backgroundGradient}
                <div className="text-center flex flex-col w-[10%] select-none text-[#6E727F] font-inter font-bold">
                    {[ ...Array(11)].map((_, i) => (
                        <p key={i}>{i + 1}</p>
                    ))}
                </div>
                <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono text-yellow-300 pr-1`}>
                    <HtmlAnimation htmlSequence={codeBlock} speed={50}/>
                </div>
            </div>
        </div>
    )
}

export {
    CodeBlocks
}