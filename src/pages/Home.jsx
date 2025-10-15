import React from "react";
import { Link } from "react-router-dom";
import { banner } from "../assets/images";
import { Footer } from "../components/Common/Footer";
import { ReviewSlider } from "../components/Common/ReviewSlider";
import { CTAButton } from "../components/Core/HomePage/Button";
import { CodeBlocks } from "../components/Core/HomePage/CodeBlocks";
import { ExploreMore } from "../components/Core/HomePage/ExploreMore";
import { HighLightText } from "../components/Core/HomePage/HighLightText";
import { InstructorSection } from "../components/Core/HomePage/InstructorSection";
import { LearningLanguageSection } from "../components/Core/HomePage/LearningLanguageSection";
import { TimelineSection } from "../components/Core/HomePage/Timeline";
import { FaArrowRight } from "react-icons/fa";

function Home(){
    return(
        <div>
            <div className="relative mx-auto flex w-11/12 max-w-[1260px] flex-col items-center justify-between gap-8 text-white">
                <Link to={"/signup"}>
                    <div className="group mx-auto mt-16 w-fit rounded-full bg-[#161D29] p-1 font-bold text-[#999DAA] drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
                        <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-[#000814]">
                            <p>Become an instructor</p>
                            <FaArrowRight/>
                        </div>
                    </div>
                </Link>
                <div className="text-center text-4xl font-semibold">
                    Empower Your Future with
                    <HighLightText text={"Coding Skills"}/>
                </div>
                <div className="-mt-3 w-[90%] text-center text-lg font-bold text-[#838894]">
                    With our online coding courses, you can learn at your own pace, from
                    anywhere in the world, and get access to a wealth of resources,
                    including hands-on projects, quizzes, and personalized feedback from
                    instructors.
                </div>
                <div className="mt-8 flex flex-row gap-7">
                    <CTAButton active={true} linkTo={"/signup"}>
                        Learn More
                    </CTAButton>
                    <CTAButton active={true} linkTo={"/login"}>
                        Book a Demo
                    </CTAButton>
                </div>
                <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-[#118AB2]">
                    <video 
                        className="shadow-[20px_20px_rgba(255,255,255)]"
                        muted
                        loop
                        autoPlay
                    >
                        <source src={banner} type="video/mp4"/>
                    </video>
                </div>
                <div>
                    <CodeBlocks
                        position={"lg:flex-row"}
                        heading={
                            <div className="text-4xl font-semibold">
                                Unlock your
                                <HighLightText text={"coding potential"}/> with our online 
                                courses.
                            </div>
                        }
                        subHeading={
                            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                        }
                        ctaBtn1={{
                            btnText: "Try it Yourself",
                            link: "/signup",
                            active: true
                        }}
                        ctaBtn2={{
                            btnText: "Learn More",
                            link: "/signup",
                            active: false
                        }}
                        codeBlock={[
                            `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                            <title>This is myPage</title>
                            </head>
                            <body>
                            <h1><a href="/">Header</a></h1>
                            <nav> <a href="/one">One</a> <a href="/two">Two</a>
                            <a href="/three">Three</a>
                            </nav>
                            </body>`
                        ]}
                        backgroundGradient={<div className="top-0 left-0 w-full h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg -z-10 absolute"></div>}
                        />
                </div>
                <div>
                    <CodeBlocks
                        position={"lg:flex-row-reverse"}
                        heading={
                            <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                                Start
                                <HighLightText text={"Coding in seconds"}/>
                            </div>
                        }
                        subHeading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
                        ctaBtn1={{
                            btnText: "Continue Lesson",
                            link: "/signup",
                            active: true
                        }}
                        ctaBtn2={{
                            btnText: "Learn More",
                            link: "/signup",
                            active: false
                        }}
                        codeBlock={[
                                `import React from "react";
                                import CTAButton from "./Button";
                                import TypeAnimation from "react-type";
                                import { FaArrowRight } from "react-icons/fa";

                                const Home = () => {
                                return (
                                <div>Home</div>
                                )
                                }
                                export default Home;`
                            ]}
                        backgroundGradient={<div className="top-0 left-0 w-full h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg -z-10 absolute"></div>}
                    />
                </div>
                <ExploreMore/>
            </div>
            <div className="bg-[#F9F9F9] text-[#2C333F]">
                <div className="homepage_bg h-[320px]">
                    <div className="mx-auto flex w-11/12 max-w-[1260px] flex-col items-center justify-between gap-8">
                        <div className="lg:h-[150px]"></div>
                        <div className="flex flex-row gap-7 text-white lg:mt-8">
                            <CTAButton
                                active={true} linkTo={"/signup"}
                            >
                                <div className="flex items-center gap-2">
                                    Explore Full Catalog
                                    <FaArrowRight/>
                                </div>
                            </CTAButton>
                            <CTAButton
                                active={false}
                                linkTo={"/login"}
                            >
                                Learn More
                            </CTAButton>
                        </div>
                    </div>
                </div>
                <div className="mx-auto flex w-11/12 max-w-[1260px] flex-col items-center justify-between gap-8 ">
                    <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
                        <div className="text-4xl font-semibold lg:w-[45%] ">
                            Get the skills you need for a{" "}
                            <HighLightText text={"job that is in demand."}/>
                        </div>
                        <div className="flex flex-col items-start gap-10 lg:w-[40%]">
                            <div className="text-[16px]">
                                The modern StudyNotion is the dictates its own terms. Today, to
                                be a competitive specialist requires more than professional
                                skills.
                            </div>
                            <CTAButton 
                                active={true}
                                linkTo={"/signup"}
                            >
                                <div className="">Learn More</div>
                            </CTAButton>
                        </div>
                    </div>
                    <TimelineSection/>
                    <LearningLanguageSection/>
                </div>
            </div>
            <div className="relative mx-auto my-20 flex w-11/12 max-w-[1260px] flex-col items-center justify-between gap-8 bg-[#000814] text-white">
                <InstructorSection/>
                <h1 className="text-center text-4xl font-semibold mt-8">
                    Reviews from other learners
                </h1>
                <ReviewSlider/>
            </div>
            <Footer/>
        </div>
    )
}

export {
    Home
}