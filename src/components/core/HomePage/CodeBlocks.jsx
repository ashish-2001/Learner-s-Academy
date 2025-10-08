import React from "react";
import { CTAButton } from "./Button";
import { TypeAnimation } from "react-type-animation";
import { FaArrowRight } from "react-icons/fa";


function CodeBlocks({position, heading, subHeading, ctaBtn1, ctaBtn2, codeBlock, backgroundGradient, codeColor}){
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
                <div className="text-center flex flex-col   w-[10%] select-none text-[#6E727F] font-inter font-bold">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                </div>
                <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1`}>
                    <TypeAnimation
                        sequence={[codeBlock, 1000, ""]}
                        cursor={true}
                        repeat={Infinity}
                        style={{
                            whiteSpace: "pre-line",
                            display: "block"
                        }}
                        omitDeletionAnimation={true}
                    />
                </div>
            </div>
        </div>
    )
}

export {
    CodeBlocks
}