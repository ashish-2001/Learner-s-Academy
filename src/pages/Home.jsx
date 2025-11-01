import React from 'react'
import {FaArrowRight} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CTAButton } from '../components/Core/HomePage/Button';
import { HighLightText } from '../components/Core/HomePage/HighLightText';
import { banner } from "../assets/images/index.js"
import { CodeBlocks } from "../components/Core/HomePage/CodeBlocks";
import { TimelineSection } from '../components/Core/HomePage/TimelineSection';
import { LearningLanguageSection } from '../components/Core/HomePage/LearningLanguageSection';
import { InstructorSection } from '../components/Core/HomePage/InstructorSection';
import { ExploreMore } from '../components/Core/HomePage/ExploreMore';
import { useDispatch } from 'react-redux';
import { setProgress } from '../slices/loadingBarSlice';
import { Course_Slider } from '../components/Core/Catalog/Course_Slider';
import { useEffect } from 'react';
import { useState } from 'react';
import { fetchCourseCategories } from '../services/operations/courseDetailsAPI';
import { getCatalogPageData } from '../services/operations/pageAndcomponentDatas';



function Home() {

    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [catalogPageData, setCatalogPageData] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            dispatch(setProgress(30));
            const result = await fetchCourseCategories();
            if(result && result.length > 0){
                setCategories(result);
                setSelectedCategoryId(result[0]._id);
            }
            dispatch(setProgress(70));
        }
        fetchCategories();
    }, [dispatch]);

    useEffect(() => {
        const fetchCatalogData = async() => {
            if(!selectedCategoryId){
                return;
            }
            dispatch(setProgress(50));
            const result = await getCatalogPageData(selectedCategoryId, dispatch);
            setCatalogPageData(result);
            dispatch(setProgress(100));
        }
        fetchCatalogData()
    }, [selectedCategoryId, dispatch]);
    
return (
    <div>
        <div className=' mx-auto relative flex flex-col w-11/12 items-center justify-between text-white '>
            <Link onClick={()=>{dispatch(setProgress(100))}}  to={"/signup"}>
            <div className=' group mt-16 p-1 mx-auto rounded-full bg-[#161D29] font-bold transition-all duration-200 hover: scale-95 w-fit max-w-[1260px]'>
                <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-[#000814]'>
            <p>Become an Instructor</p><FaArrowRight/>
                </div>
            </div>
            </Link>

            <div className='text-center text-3xl md:text-4xl font-semibold mt-7'>
                Empower Your Future With <HighLightText text={"Coding Skills"}/>
            </div>
            <div className=' mt-4 w-[90%] text-left md:text-center text-sm md:text-lg font-bold text-[#838894]'>
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
            </div>

            <div className='flex flex-row gap-7 mt-8'>
                <CTAButton active={true} linkto={"/signup"}>
                    Learn More
                </CTAButton>
                <CTAButton active={false} linkto={"/login"} >Book a Demo</CTAButton>
            </div>

            <div className='mx-3 my-15 shadow-[#118AB2] shadow-[100_-5px_50px_-5px] w-[70%]'>
                <div className='relative w-[772.95px] h-[457.05px] left-[calc(50%-372.95px/2-76.53px)] top-[calc(18%-257.05px/2-47.47px)] bg-[linear-gradient(118.19deg,#1FA2FF_-3.62%,#12D8FA_50.44%,#A6FFCB_104.51%)] opacity-20 blur-[34px] [transform:matrix(1,0,-0.03,1,0,0)] z-0'></div>
                <video className='absolute h-[500px] top-[400px]'
                    muted
                    loop
                    autoPlay
                >
                    <source  src={banner} type="video/mp4" />
                </video>
            </div>

        <div>
            <CodeBlocks 
                position={"lg:flex-row"}
                heading={
                    <div className=' font-semibold text-2xl lg:text-4xl sm:w-full'>
                        Unlock Your
                        <HighLightText text={"coding potential"}/>
                        with our online courses
                    </div>
                }
                subheading = {
                    "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }
                ctabtn1={
                    {
                        btnText: "Try it yourself",
                        linkto: "/signup",
                        active: true,
                    }
                }
                ctabtn2={
                    {
                        btnText: "learn more",
                        linkto: "/login",
                        active: false,
                    }
                }

                codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n</head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="one/">One</a>\n<a href="two/">Two</a>\n<a href="three/">Three</a>\n</nav>`}
                codeColor={"white"}
                backgroundGradient={<div className='absolute w-[372.95px] h-[257.05px] rounded-full left-[calc(50%-372.95px/2-76.53px)] top-[calc(50%-257.05px/2-47.47px)] bg-[linear-gradient(123.77deg,#8a2be2_-6.46%,#ffa500_59.04%,#f8f8ff_124.53%)] opacity-20 blur-[34px] [transform:matrix(1,0,-0.03,1,0,0)]'></div>}
            />
        </div>
        <div className=' mx-auto box-content w-full max-w-[650px] px- py-12 lg:max-w-[1260px]'>
        <h2 className='section_heading mb-6 md:text-3xl text-xl'>
            Most Popular Courses
        </h2>
        <Course_Slider courses={catalogPageData?.selectedCourses}/>
    </div>       
        <div className=' mx-auto box-content w-full max-w-[650px] px- py-12 lg:max-w-[1260px]'>
        <h2 className='section_heading mb-6 md:text-3xl text-xl'>
            Students are learning
        </h2>
        <Course_Slider courses={catalogPageData?.differentCourses}/>
    </div>       


                {/* Code Section 2 */}
        <div>
            <CodeBlocks 
                position={"lg:flex-row-reverse"}
                heading={
                    <div className='text-4xl font-semibold'>
                        Start
                        <HighLightText text={"coding in seconds"}/>
                    </div>
                }
                subheading = {
                    "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                }
                ctabtn1={
                    {
                        btnText: "Continue Lesson",
                        linkto: "/signup",
                        active: true,
                    }
                }
                ctabtn2={
                    {
                        btnText: "learn more",
                        linkto: "/login",
                        active: false,
                    }
                }

                codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n</head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="one/">One</a>\n<a href="two/">Two</a>\n<a href="three/">Three</a>\n</nav>`}
                codeColor={"text-[#FFE83D]"}
                backgroundGradient={<div className='w-[372.95px] h-[257.05px] left-[calc(50%-372.95px/2-76.53px)] top-[calc(50%-257.05px/2-47.47px)] rounded-full bg-[linear-gradient(118.19deg,#1fa2ff_-3.62%,#12d8fa_50.44%,#a6ffcb_104.51%)] opacity-20 blur-[34px] [transform:matrix(1,0,-0.03,1,0,0)] absolute'></div>}
            />
        </div>

        <ExploreMore/>

        </div>
        <div className='hidden lg:block lg:h-[200px]'></div>


        <div className='bg-[#F9F9F9] text-[#2C333F]'>
            <div className='homepage_bg h-[310px]'>

                <div className='w-11/12 max-w-[1260px] flex flex-col items-center justify-between gap-5 mx-auto'>
                    <div className='h-[150px]'></div>
                    <div className='flex flex-row gap-7 text-white '>
                        <CTAButton active={true} linkto={"/catalog/Web Development"}>
                            <div className='flex items-center gap-3' >
                                Explore Full Catalog
                                <FaArrowRight />
                            </div>
                            
                        </CTAButton>
                        <CTAButton active={false} linkto={"/signup"}>
                            <div>
                                Learn more
                            </div>
                        </CTAButton>
                    </div>

                </div>

            </div>

            <div className='mx-auto w-11/12 max-w-[1260px] flex flex-col items-center justify-between gap-7'>

                <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
                    <div className='text-4xl font-semibold w-[45%]'>
                        Get the Skills you need for a
                        <HighLightText text={"Job that is in demand"} />
                    </div>

                    <div className='flex flex-col gap-10 w-[40%] items-start'>
                    <div className='text-[16px]'>
                    The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                    </div>
                    <CTAButton active={true} linkto={"/signup"}>
                        <div>
                            Learn more
                        </div>
                    </CTAButton>
                    </div>

                </div>
                
                

                <TimelineSection />

                <LearningLanguageSection />

            </div>
        </div>
    <div className='w-11/12 mx-auto max-w-[1260px] flex-col items-center justify-between gap-8 first-letter bg-[#000814] text-white'>

            <InstructorSection />

            {/* Review Slider here */}
    </div>
    <div className=' mb-16 mt-3'>
        <h2 className='text-center text-2xl md:text-4xl font-semibold mt-8 text-[#F1F2FF] mb-5'>Reviews from other learners</h2>
        <Course_Slider />
    </div>
    </div>
)
}

export {
    Home
}