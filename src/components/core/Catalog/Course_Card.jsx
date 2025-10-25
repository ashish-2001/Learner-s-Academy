import React, { useEffect, useState } from 'react'
import { RatingStars } from '../../Common/RatingStars'
import { GetAvgRating } from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const Course_Card = ({ course, Height }) => {

    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(()=> {
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    }, [course])


    
return (
<div className='mb-4 hover:scale-[1.03] transition-all duration-200 z-50 '>
    <Link to={`/courses/${course._id}`}>
        <div>
            <div>
                <img 
                    src={course?.thumbnail}
                    alt='Course thumbnail'
                    className={`${Height}  rounded-xl object-cover`}
                />
            </div>
            <div className='flex flex-col gap-2 px-1 py-3'>
                <p className='text-sm md:text-xl text-[#F1F2FF]'>{course?.courseName}</p>
                <p className='text-[12px] md:text-xl text-[#F1F2FF]'>By <span className='text-[#FFD60A]'>{course?.instructor?.firstName} {course?.instructor?.lastName}</span></p>
                <div className='flex gap-x-3'>
                    <span className='text-[#FFD60A]'>{avgReviewCount || 0}</span>
                    <RatingStars Review_Count={avgReviewCount} />
                    <span className=' md:block hidden md:text-xl text-[#F1F2FF]'>{course?.ratingAndReviews?.length} Ratings</span>
                </div>
                <p className='text-sm md:text-xl text-[#F1F2FF]'>Rs.{course?.price}</p>
            </div>
        </div>
    </Link>
</div>
)
}

export {
    Course_Card
}