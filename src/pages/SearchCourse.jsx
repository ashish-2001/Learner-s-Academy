import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { searchCourses } from '../services/operations/courseDetailsAPI'
import { useState } from 'react'
import { Course_Card } from '../components/core/Catalog/Course_Card';
import { useDispatch } from 'react-redux';
import { HiOutlineEmojiSad } from 'react-icons/hi';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";

const SearchCourse = () => {

    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch= useDispatch();
    const { searchQuery } = useParams();

    const fetchSearchResults= async ()=>{
        setLoading(true);
        const res = await searchCourses(searchQuery, dispatch);
        setSearchResults(res || []);
        setLoading(false);
        console.log(res);
    };

    useEffect(() => {
        fetchSearchResults();
    }, [searchQuery]);

  return (
    <div>
      <div className='mx-auto flex min-h-[260px]  flex-col justify-center gap-4 p-5 bg-[#161D29] '>
        <p className='text-sm text-[#838894]'>Home / Search / <span className='text-[#FFE83D]'>{searchQuery}</span> </p>
        <p className='text-3xl text-[#F1F2FF]'>Search Results for {searchQuery}</p>
        <p className='max-w-[870px] text-[#999DAA]'>
            {searchResults?.length} results found for {searchQuery}
        </p>
      </div>
        {
          loading ? (
          <div className='flex gap-6 flex-wrap justify-evenly overflow-hidden m-9'>
            <SkeletonTheme baseColor="#2C333F" highlightColor="#161D29">
          <div className=''>
            <Skeleton  className="md:h-[200px] lg:w-[400px] h-[100px] w-[200px] rounded-xl" />
            <Skeleton className=" md:h-[20px] w-[70px] rounded-md" />
            <Skeleton className="md:h-[20px] md:w-[400px] rounded-md" />
            <Skeleton className="md:h-[20px] md:w-[400px] rounded-md"/>
          </div>
            </SkeletonTheme>
                <SkeletonTheme baseColor="#2C333F" highlightColor="#161D29">
              <div className=''>
                <Skeleton  className="md:h-[200px] lg:w-[400px] h-[100px] w-[200px] rounded-xl" />
                <Skeleton className=" md:h-[20px] w-[70px] rounded-md" />
                <Skeleton className="md:h-[20px] md:w-[400px] rounded-md" />
                <Skeleton className="md:h-[20px] md:w-[400px] rounded-md"/>
              </div>
            </SkeletonTheme>
                <SkeletonTheme baseColor="#2C333F" highlightColor="#161D29">
              <div className=''>
                <Skeleton  className="md:h-[200px] lg:w-[400px] h-[100px] w-[200px] rounded-xl" />
                <Skeleton className=" md:h-[20px] w-[70px] rounded-md" />
                <Skeleton className="md:h-[20px] md:w-[400px] rounded-md" />
                <Skeleton className="md:h-[20px] md:w-[400px] rounded-md"/>
              </div>
            </SkeletonTheme>
          </div>
        ): searchResults?.length===0 ? (
            <div className='mx-auto flex min-h-[500px] items-center  flex-col justify-center gap-4 p-5 bg-[#000814] '>
              <p className='text-3xl text-[#F1F2FF]'>No Results Found</p>
              <HiOutlineEmojiSad className=' text-[#AFB2BF] text-[100px]' />
            </div> ) : (
              <div className='mx-auto flex flex-wrap p-5 gap-4 justify-evenly m-5'>
                {searchResults?.map((item)=>(
                    <div className='flex flex-col gap-4' key={item._id}>
                    <Course_Card course={item} Height={"lg:h-[250px] h-[100px]"} />
                    </div>
                ))}
              </div>
            )
        }   
    </div>
  );
};

export {
  SearchCourse
};