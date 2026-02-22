import React from 'react'
import { useEffect } from 'react';
import { RxCross2 } from 'react-icons/rx'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form';
import ReactStars from 'react-rating-stars-component';
import { createRating } from '../../../services/operations/courseDetailsAPI';
import { useParams } from 'react-router';

const ReviewModal = ({ setReviewModal }) => {
  const {user}= useSelector(state => state.profile);
  const {token} = useSelector(state => state.auth);
  const {courseId} = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();


  useEffect(()=>{
    setValue("userExperience","");
    setValue("userRating",undefined);
  }, []);

  const ratingChanged = (newRating) => {
    setValue("userRating",newRating);
  };


  const onSubmit = async (data) => {
    const res = await createRating({
      courseId: courseId,
      review:data.userExperience,
      rating:data.userRating
    },token);

    setReviewModal(false);
    console.log(res);

  };

  return (
    <div>
      <div className=' z-50 my-10 w-11/12 max-w-[700px] rounded-lg border border-[#6E727F] bg-[#161D29] fixed left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2'>
        <div className='flex items-center justify-between rounded-t-lg bg-[#2C333F] p-5'>
          <p className='text-xl font-semibold text-[#F1F2FF]'>Add Review</p>
          <button>
            <RxCross2 onClick={()=>{setReviewModal(false)}} className=' text-xl text-[#DBDDEA]'/>
          </button>
        </div>
        <div className='p-5'>
          <div className='flex items-center justify-center gap-x-4'>
            <img className='aspect-square w-[50px] rounded-full object-cover' src={user?.image} alt="user" />
            <div>
              <p className='font-semibold text-[#F1F2FF]'>{user?.firstName} {user?.lastName}</p>
              <p className='text-sm text-[#F1F2FF]'>Posting Publicly</p>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className='mt-6 flex flex-col items-center' >
            <ReactStars onChange={ratingChanged} count={5} size={24} activeColor="#ffd700" />
            <input value={getValues().userRating} {...register("userRating", { required: true })} type="hidden" />
            {errors.userRating && <span className='text-[#EF476F] text-[11px]'>* Please provide your rating</span>}
            <div className='flex w-11/12 flex-col space-y-2'>
              <label htmlFor="userExperience" className='text-sm text-[#F1F2FF]'>Add Your Experience <span className='text-[#EF476F]'>*</span> </label>
              <textarea {...register("userExperience", { required: true })} className='form-style resize-x-none min-h-[130px] w-full' placeholder='Write your experience...'></textarea>
              {errors.userExperience && <span className='text-[#EF476F] text-[12px]'>* Please provide your experience</span>}
            </div>
            <div className='mt-6 flex w-11/12 justify-end gap-x-2'>
              <button onClick={()=>{setReviewModal(false)}} className='px-4 py-2 rounded-lg text-sm font-medium bg-[#838894]'>Cancel</button>
              <button type='submit' className='px-4 py-2 rounded-lg text-sm font-medium text-black  bg-[#E7C009]'>Submit</button>
            </div>
          </form>
        </div>
      </div>
      <div className='fixed inset-0 z-10 !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm over'></div>
    </div>
  );
};

export {
    ReviewModal
};