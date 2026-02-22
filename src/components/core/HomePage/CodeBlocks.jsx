import React from 'react';
import { CTAButton } from "../HomePage/Button";
import {FaArrowRight} from "react-icons/fa";
import { TypeAnimation } from 'react-type-animation';

const CodeBlocks = ({ position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor }) => {

    return (
            <div className={`flex ${position} my-20 justify-between gap-10 flex-wrap `}>
                <div className=' flex flex-col gap-8 lg:w-[50%] p-4'>
                    {heading}
                <div className='text-[#838894] font-bold text-sm p-4 md:text-lg'>
                    {subheading}
                </div>
                <div className='flex gap-7 mt-7 p-3'>
                    <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                        <div className='flex gap-2 items-center'>
                            {ctabtn1.btnText}
                            <FaArrowRight/>
                        </div>
                    </CTAButton>
                    <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>  
                        {ctabtn2.btnText}
                    </CTAButton>
                </div>
            </div>
            <div className='h-fit border-[1px] rounded-2xl border-solid [border-image-slice:1] [border-image-source:linear-gradient(to_right_bottom,#ffffff38,#ffffff00)] bg-[linear-gradient(111.93deg,rgba(14,26,45,0.24)_-1.4%,rgba(17,30,50,0.38)_104.96%)] backdrop-blur-[26px] flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px]'>
                <div className='text-center rounded-md flex flex-col w-[10%] text-[#6E727F] font-inter font-bold'>
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
                <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2 relative`}>
                    {backgroundGradient}
                    <TypeAnimation
                        sequence={[codeblock, 2000, ""]}
                        repeat={Infinity}
                        cursor={true}
                        style = {
                            {
                                whiteSpace: "pre-line",
                                display:"block",
                                overflowX:"hidden",
                                fontSize:"16px",
                            }
                        }
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