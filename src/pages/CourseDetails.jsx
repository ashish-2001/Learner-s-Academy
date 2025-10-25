import React, { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { RatingStars } from '../components/Common/RatingStars';
import { GetAvgRating } from '../utils/avgRating';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { BsGlobe } from 'react-icons/bs';
import { FaShareSquare } from 'react-icons/fa';
import { IoIosVideocam } from 'react-icons/io';
import { addToCart } from '../slices/cartSlice';
import { ACCOUNT_TYPE } from '../utils/constants.js';
import { FaChevronDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { BuyCourse } from '../services/operations/studentFeaturesAPI';
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI';

const CourseDetails = () => {
    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {courseId} = useParams();
    const [courseDetail, setCourseDetail] = useState(null);
    const [avgReviewCount, setAvgReviewCount] = useState(0);
    const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
    const {cart}=useSelector((state)=>state.cart);


    const handelPayment = () => {
        if(token){
            BuyCourse(token,[courseId],user,navigate,dispatch);
        }
        else{
            navigate('/login');
        }
    }

    useEffect(() => {
        const getCourseDetails = async() => {
            const response = await fetchCourseDetails(courseId,dispatch);
            // console.log("getCourseDetails -> response", response);
            setCourseDetail(response);
        }
        getCourseDetails();
    }, [courseId]);

    useEffect(() => {
        if(courseDetail?.ratingAndReviews?.length > 0){
            const count = GetAvgRating(courseDetail?.ratingAndReviews);
            setAvgReviewCount(count);
            console.log("getCourseDetails -> count", parseInt(count));
            }
    }, [courseDetail?.ratingAndReviews]);


    //add to cart
    const handelAddToCart = () => {
        if(token){
        dispatch(addToCart(courseDetail));
        // console.log("handelAddToCart -> courseId", courseDetail._id)
        }
        else{
            navigate('/login');
        }
    }


    useEffect (() => {
    if(courseDetail){
        const Enrolled = courseDetail?.studentsEnrolled?.find((student) => student === user?._id);
        // console.log("CourseDetails -> Enrolled", Enrolled)
        if(Enrolled){
            setAlreadyEnrolled(true);
        }
    }
    }, [courseDetail, user?._id])





    if(!courseDetail) return <div className='flex justify-center items-center h-screen'>
        <div className='custom-loader'></div>
    </div>

  return (
    <div>
        <div className='mx-auto box-content px-4 lg:w-[1260px] lg:relative '>
            <div className='mx-auto grid min-h-[450px] max-w-[650px] justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]'>
                <div className='relative block max-h-[30rem] lg:hidden'>
                    <div className='absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]'></div>
                        <img src={courseDetail?.thumbnail} alt="course img" />
                </div>
                    <div className='z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-[#F1F2FF]'>  
                            <p className='text-4xl font-bold text-[#F1F2FF] sm:text-[42px]'>{courseDetail?.courseName}</p>
                            <p className='text-[#999DAA]'>{courseDetail?.courseDescription}</p>
                            <div className='flex gap-x-3 items-center'>
                        <span className='text-[#FFD60A]'>{avgReviewCount || 0}</span>
                        <RatingStars Review_Count={avgReviewCount} />
                        <span className=' md:block hidden md:text-xl text-[#F1F2FF]'>({courseDetail?.ratingAndReviews?.length} Reviews)</span>
                        {/* student enrolled */}
                        <span className='text-[#999DAA]'>{courseDetail?.studentsEnrolled?.length} students enrolled</span>
                    </div>
                    <div>
                        <p>Created By {courseDetail?.instructor?.firstName}  {courseDetail?.instructor?.lastName}</p>
                    </div>
                    <div className='flex flex-wrap gap-5 text-lg'>
                        <AiOutlineInfoCircle className='text-2xl text-[#F1F2FF]' />
                        <p className='text-[#C5C7D4]'>Created at &nbsp;    
                        {new Date(courseDetail?.createdAt || courseDetail?.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                        </p>
                        <p className='flex items-center gap-2 text-[#C5C7D4]'><BsGlobe className='text-lg text-[#C5C7D4]'/>English</p>
                    </div>
                    </div>
                    <div className='flex w-full flex-col gap-4 border-y border-y-[#585D69] py-4 lg:hidden'>
                        <p className='space-x-3 pb-4 text-3xl font-semibold text-[#F1F2FF]'>
                            <span>₹{courseDetail?.price}</span></p>
                            {ACCOUNT_TYPE.INSTRUCTOR !==user?.accountType &&
                            <>
                            {
                                alreadyEnrolled ? <button onClick={()=>{navigate("/dashboard/enrolled-courses")}}  className='yellowButton'>Go to Course</button> : <button onClick={handelPayment} className='yellowButton'>Buy Now</button>
                            }
                            {
                                alreadyEnrolled ? (<div></div>) : 
                                (
                                    cart?.find((item) => item?._id === courseDetail?._id) ?
                                    (<button onClick={()=>{navigate("/dashboard/cart")}} className='blackButton text-[#F1F2FF]'>Go to Cart</button>) :
                                    (<button onClick={handelAddToCart} className='blackButton text-[#F1F2FF]'>Add to Cart</button>)
                                )
                            }
                            </>
                            }
                    </div>
                </div>
                <div className='right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block'>
                    <div className='flex flex-col gap-4 rounded-md bg-[#2C333F] p-4 text-[#F1F2FF]'>
                        <img src={courseDetail?.thumbnail} alt="course img" className='max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full' />
                        <div className='px-4'>
                            <div className='space-x-3 pb-4 text-3xl font-semibold'>
                                <span>₹{courseDetail?.price}</span>
                            </div>
                            <div className='flex flex-col gap-4'>
                                {ACCOUNT_TYPE.INSTRUCTOR !== user?.accountType &&
                                <>
                                {
                                    alreadyEnrolled ? <button onClick={()=>{navigate("/dashboard/enrolled-courses")}} className='yellowButton'>Go to Course</button> : <button onClick={handelPayment} className='yellowButton'>Buy Now</button>
                                }
                                {
                                alreadyEnrolled ? (<div></div>) : 
                                (
                                    cart?.find((item) => item._id === courseDetail._id) ?
                                    (<button onClick={()=>{navigate("/dashboard/cart")}} className='blackButton text-[#F1F2FF]'>Go to Cart</button>) :
                                    (<button onClick={handelAddToCart} className='blackButton text-[#F1F2FF]'>Add to Cart</button>)
                                )
                            }
                                </>
                                }
                            </div>
                            <div className='pb-3 pt-6 text-center text-sm text-[#DBDDEA]'>
                                <p>30-Day Money-Back Guarantee</p>
                            </div>
                            <div className=''>
                                <p className='my-2 text-xl font-semibold '>This course includes</p>
                                <div className='flex flex-col gap-1 text-sm text-[#06D6A0]'>
                                    {
                                        JSON.parse(courseDetail?.instructions).map((item,index) => (
                                            <div key={index} className='flex gap-2 items-center'>
                                                <span className='text-lg'>✓</span>
                                                <span>{item}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className='text-center'>
                                {/* copy url */}
                                <button className='mx-auto flex items-center gap-2 py-6 text-[#E7C009]' onClick={
                                    () => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success('URL copied to clipboard');
                                    }
                                }>
                                    <FaShareSquare className='text-xl text-[#CFAB08]'/>
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mx-auto box-content px-4 text-start text-[#F1F2FF] lg:w-[1260px]'>
                <div className='mx-auto max-w-[650px] lg:mx-0 xl:max-w-[810px]'>
                    <div className='my-8 border border-[#424854] p-8'>
                        <p className='text-3xl font-semibold'>
                            What you will learn
                        </p>
                        <div className='mt-5'>
                            {
                                courseDetail?.whatWillYouLearn
                            }
                        </div>
                    </div>
                    <div className='max-w-[830px] '>
                        <div className='flex flex-col gap-3'>
                            <p className='text-[28px] font-semibold'>Course Content</p>
                            <div className='flex flex-wrap justify-between gap-2'>
                                <div className='flex gap-2'>
                                <span>{courseDetail?.courseContent?.length} Section(s)</span>
                                <span>{courseDetail?.courseContent?.reduce((acc, item) => acc + item?.subSection?.length, 0)} Lecture(s)</span>
                                </div>
                                <button className='text-[#FFE83D]'>
                                    <span>Collapse al sections</span>
                                </button>
                            </div>
                        </div>
                        <div className='py-4'>
                            {
                                courseDetail?.courseContent?.map((item, index) => (
                                    <details key={index} className=' border border-solid border-[#424854] bg-[#2C333F] text-[#F1F2FF] detailanimatation'>
                                        <summary className='flex cursor-pointer items-start justify-between bg-opacity-20 px-7  py-5 transition-[0.3s]'>
                                            <div className='flex items-center gap-2'>
                                            <FaChevronDown className='arrow '/>
                                            <span className='text-xl'>{item?.sectionName}</span>
                                            </div>
                                            <div className='space-x-4'>
                                                <span className='text-[#FFE83D]'>{item?.subSection?.length} Lecture(s)</span>
                                            </div>
                                        </summary>
                                        <div className='mt-5'>
                                            {
                                                item?.subSection?.map((subItem, subIndex) => (
                                                    <div key={subIndex} className='relative overflow-hidden bg-[#000814]  p-5 border border-solid border-[#424854]'>
                                                        <div className='flex items-center gap-2'>
                                                        <IoVideoCamOutline className='txt-lg text-[#F1F2FF]'/>
                                                        <span className='text-lg'>{subItem?.title}</span>
                                                        </div>
                                                    </div>
                                                    
                                                ))
                                            }
                                            </div>
                                    </details>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className='mb-12 py-4'>
            </div>
                <p className='text-[28px] font-semibold'>
                    Author
                </p>
                <div className='flex items-center gap-4 py-4'>
                    <img src={courseDetail?.instructor.image} alt="author img" className='w-[50px] h-[50px] rounded-full object-cover'/>
                    <p className='text-xl font-semibold'>{courseDetail?.instructor?.firstName} {courseDetail?.instructor?.lastName}</p>
                </div>
                <p className='text-[#C5C7D4] text-sm mb-10'>{courseDetail?.instructor?.additionalDetails?.about}</p>
            </div>

            {/* Reviews */}
            <div className='mx-auto box-content px-4 text-start text-[#F1F2FF] lg:w-[1260px]'>
                <div className='mx-auto max-w-[650px] lg:mx-0 xl:max-w-[990px]'>
                    <div className='my-8 border border-[#424854] p-3 md:p-8'>
                        <p className='text-3xl font-semibold'>
                            Reviews
                        </p>
                        <div className='mt-5'>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-2'>
                                    <span className='text-4xl font-semibold'>{avgReviewCount}</span>
                                    <span className='text-2xl'>/5</span>
                                    <span className='text-[#C5C7D4]'>({courseDetail?.ratingAndReviews?.length} ratings)</span>
                                    <span className='text-[#C5C7D4]'>|</span>
                                    <span className='text-[#C5C7D4]'> {courseDetail?.studentsEnrolled?.length} students</span>
                                    </div>
                                </div>
                                </div>
                                {
                                    courseDetail?.ratingAndReviews?.map((item, index) => (
                                        <div key={index} className='flex flex-col md:items-baseline gap-3 my-4 mt-12 ga'>
                                            <div className='flex items-center gap-2'>
                                                <img src={item?.user?.image} alt="user img" className='w-[30px] h-[30px] rounded-full object-cover'/>
                                                <div className='flex flex-col'>
                                                    <p className='md:text-xl min-w-max font-semibold'>{item?.user?.firstName} {item?.user?.lastName}</p>
                                                </div>
                                            </div>
                                            <div className='flex flex-col gap-2'>
                                                <div className='flex items-center gap-2'>
                                                    <RatingStars Review_Count={item?.rating}/>
                                                </div>
                                                <p className='text-[#C5C7D4] text-[12px] md:text-sm max-w-4xl'>{item?.review}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                                </div>
                                </div>
                                </div>
                                

        </div>
  )
}

export {
    CourseDetails
}