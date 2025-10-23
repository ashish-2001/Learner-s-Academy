import React from "react";
import { FooterLink2 } from "../../data/FooterLink2";
import { Link } from "react-router-dom";
import { Logo_Full_Light } from "../../assets/logo";
import { FaHeart } from "react-icons/fa";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [ "Articles", "Blog", "Chart sheet", "Code Challenges", "Docs", "Projects", "Videos", "Workspaces"];
const Plans = ["Paid Memberships", "For Students", "Business Solutions"];
const Community = ["Forums", "Chapters", "Events"];

function Footer(){
    return(
        <div className="bg-[#161D29]">
            <div className="flex lg:flex-row gap-8 items-center justify-between w-11/12 max-w-1260px text-[#6E727F] leading-6 mx-auto relative py-14">
                <div className="border-b w-[100%] flex flex-col lg:flex-row pb-5 border-[#2C333F]">
                    <div className="lg:[50%] flex flex-wrap flex-row justify-between lg:border-[#2C333F] lg:pr-5 gap-3" >
                        <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0">
                            <img src={Logo_Full_Light} alt="" className="object-obtain"/>
                            <h1 className="text-[#838894] font-semibold text-[16px]">
                                Company
                            </h1>
                            <div className="flex flex-col gap-2">
                                {["About", "Careers", "Affiliates"].map((ele, i) => {
                                    return (
                                        <div className="text-[14px] cursor-pointer hover:text-[#C5C7D4] transition-all duration-200" key={i}>
                                            <Link to={ele.toLowerCase()}>{ele}</Link>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-3 text-lg">
                                <FaFacebook/>
                                <FaGoogle/>
                                <FaTwitter/>
                                <FaYoutube/>
                            </div>
                            <div></div>
                        </div>
                        <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                            <h1 className="text-[#C5C7D4] font-semibold text-[16px]">
                                Resources
                            </h1>
                            <div className="flex flex-col gap-2 mt-2">
                                {Resources.map((ele, i)=>{
                                    return (
                                        <div className="text-[14px] cursor-pointer hover:text-[#C5C7D4] transition-all duration-200" key={i}>
                                            <Link to={ele.split(" ").join("-").toLowerCase()}>{ele}</Link>
                                        </div>
                                    )
                                })}
                            </div>

                            <h1 className="text-[#C5C7D4] font-semibold text-[16px] mt-7">
                                Support
                            </h1>
                            <div className="text-[14px] cursor-pointer hover:text-[#C5C7D4] transition-all duration-200 mt-2">
                                <Link to={"/help-center"}>Help Center</Link>
                            </div>
                        </div>

                        <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                            <h1 className="text-[#C5C7D4] font-semibold text-[16px]">
                                Plans
                            </h1>

                            <div className="flex flex-col gap-2 mt-2">
                                {Plans.map((ele, i)=> {
                                    return(
                                        <div className="text-[14px] cursor-pointer hover:text-[#C5C7D4] transition-all duration-200" key={i}>
                                            <Link to={ele.split(" ").join("-").toLowerCase()}>{ele}</Link>
                                        </div>
                                    )
                                })}
                            </div>

                            <h1 className="text-[#C5C7D4] font-semibold text-[16px] mt-7">
                                Community
                            </h1>

                            <div className="flex flex-col gap-2 mt-2">
                                {Community.map((ele, i) =>{
                                    return(
                                        <div className="text-[14px] cursor-pointer hover:text-[#C5C7D4] transition-all duration-200" key={i}>
                                            <Link to={ele.split(" ").join("-").toLowerCase()}>{ele}</Link>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
                        {FooterLink2.map((ele, i) => {
                            return (
                                <div className="w-[48%] lg:[30%] mb-7 lg:pl-0" key={i}>
                                    <h1 className="text-[#C5C7D4] font-semibold text-[16px]">
                                        {ele.title}
                                    </h1>
                                    <div className="flex flex-col gap-2 mt-2">
                                        {ele.links.map((link, index) =>{
                                            return (
                                                <div className="text-[14px] cursor-pointer hover:text-[#C5C7D4] transition-all duration-200" key={index}>
                                                    <Link to={link.link}>{link.title}</Link>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="flex flex-row items-center justify-between w-11/12 max-w-1260px text-[#fff] mx-auto pb-14 text-sm">
                <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
                    <div className="flex flex-row">
                        {BottomFooter.map((ele, i) => {
                            return (
                                <div className={`${BottomFooter.length - 1 === i ? "" : "border-r border-[#fff] cursor-pointer hover:text-[#fff] transition-all duration-200" } px-3 `} key={i}>
                                    <Link to={ele.split(" ").join("-").toLowerCase()}>{ele}</Link>
                                </div>
                            )
                        })}
                    </div>
                    <div className="text-center flex justify-center items-center gap-2">Made with <FaHeart className="text-red-600" /> from Ashish pal</div>
                    <div>
                        Learners Academy
                    </div>
                </div>
            </div>
        </div>
    )
}

export {
    Footer
}