import React, { useEffect, useState } from 'react'
import { RatingStars } from '../../common/RatingStars'
import { GetAvgRating } from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const Course_Card = ({ course, Height }) => {

    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(()=> {
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    }, [course]);

return (
        <div className='mb-4 hover:scale-[1.01] transition-all duration-200 z-50 m-3 border-[1px] border-gray-300 rounded-3xl'>
            <Link to={`/courses/${course._id}`}>
                <div>
                    <div className='rounded-xl'>
                        <img 
                            src={course?.thumbnail || course?.thumbnailImage}
                            alt='Course thumbnail'
                            className={`${Height} w-[600px] p-[20px] rounded-xl object-cover`}
                        />
                    </div>
                    <div className='flex flex-col gap-2 px-1 py-3 bg-gray-800 rounded-b-3xl pl-5'>
                        <p className='text-sm md:text-xl text-gray-700 bg-white mr-4 text-center rounded-md font-semibold'>{course?.courseName}</p>
                        <p className='text-[12px] md:text-xl text-[#F1F2FF]'>By <span className='text-[#FFD60A]'>{course?.instructor?.firstName} {course?.instructor?.lastName}</span></p>
                        <div className='flex gap-x-3  items-center'>
                            <span className='text-[#FFD60A]'>{avgReviewCount}</span>
                            <RatingStars Review_Count={avgReviewCount.length} />
                            <span className='md:block hidden md:text-xl text-[#F1F2FF]'> Ratings</span>
                        </div>
                        <p className='text-sm md:text-xl text-green-500'><span className='text-red-500'>Rs. </span> {course?.price}/-</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export {
    Course_Card
};