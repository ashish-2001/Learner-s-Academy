import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { markLectureAsCompleted } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { IconBtn } from "../../common/IconBtn";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function VideoDetails(){
    const { courseId, sectionId, subSectionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const playerRef = useRef();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth)
    const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse)

    const [videoData, setVideoData] = useState([]);
    const [previewSource, setPreviewSource] = useState("");
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        ;(async () => {
            if(!courseSectionData.length) return;
            if(!courseId && !sectionId && !subSectionId){
                navigate(`/dashboard/enrolled-courses`);
            } else{
                const filteredData = courseSectionData.filter(
                    (course) => course._id === sectionId
                );

                const filteredVideoData = filteredData?.[0].subSection.filter(
                    (data) => data._id === subSectionId
                );

                setVideoData(filteredVideoData[0])
                setPreviewSource(courseEntireData.thumbnail);
                setVideoEnded(false);
            };
        })();
    }, [courseSectionData, courseEntireData, location.pathname]);

    function isFirstVideo(){
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

        if(currentSectionIndex === 0 && currentSubSectionIndex === 0){
            return true;
        } else{
            return false;
        };
    };

    function goToNextVideo(){
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

        if(currentSubSectionIndex !== noOfSubSections - 1){
            const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex + 1]._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
        } else{
            const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
            const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subSection._id;

            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
        };
    };

    function isLastVideo(){
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

        if(currentSectionIndex === courseSectionData.length - 1 && currentSubSectionIndex === noOfSubSections - 1){
            return true;
        } else{
            return false;
        };
    };

    const goToPrevVideo = () =>{
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

        if(currentSubSectionIndex !== 0){
            const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1]._id;
            
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`);
        } else{
            const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
            const prevSubSectionLength = courseSectionData[currentSectionIndex - 1].subSection.length;
            const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subSection[prevSubSectionLength - 1]._id;
            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
        };
    };

        const handleLectureCompletion = async() => {
            setLoading(true);
            const res = await markLectureAsCompleted(
                {courseId: courseId, subSectionId:subSectionId},
                token
            );
            if(res){
                dispatch(updateCompletedLectures(subSectionId))
            };
            setLoading(false);
        };

        return(
            <div className="flex flex-col gap-5 text-white">
                {!videoData ? (
                    <img
                        src={previewSource}
                        alt="Preview"
                        className="h-full w-full rounded-md object-cover"
                    />
                ) : (
                    <ReactPlayer 
                        ref={playerRef}
                        controls
                        playing={true}
                        onEnded={() => setVideoEnded(true)}
                        url={videoData?.videoUrl}
                        width={"100%"}
                        height={"100%"}
                    >   
                        
                        {videoEnded && (
                            <div style={{backgroundImage: "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)"}} className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter">
                                {!completedLectures.includes(subSectionId) && (
                                    <IconBtn
                                        disabled={loading}
                                        onClick={() => handleLectureCompletion()}
                                        text={!loading ? "Mark as completed" : "Loading..."}
                                        customClasses={"text-xl max-w-max px-4 mx-auto"}
                                    />
                                )}
                                <IconBtn
                                    disabled={loading}
                                    onClick={() => {
                                        if(playerRef?.current){
                                            playerRef?.current?.seek(0)
                                            setVideoEnded(false)
                                        }
                                    }}
                                    text={"ReWatch"}
                                    customClasses={"text-xl max-w-max px-4 mx-auto mt-2"}
                                />
                                <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                                    {!isFirstVideo() && (
                                        <button
                                            disabled={loading}
                                            onClick={goToPrevVideo}
                                            className="cursor-pointer rounded-md bg-[#161D29] px-[20px] py-[8px] font-semibold text-[#F1F2FF]"
                                        >Prev</button>
                                    )}
                                    {!isLastVideo() && (
                                        <button 
                                            disabled={loading}
                                            onClick={goToNextVideo}
                                            className="cursor-pointer rounded-md bg-[#161D29] px-[20px] py-[8px] font-semibold text-[#F1F2FF]"
                                        >Next</button>
                                    )}
                                </div>
                            </div>
                        )}
                    </ReactPlayer>
                )}
                <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
                <p className="pt-2 pb-6">{videoData?.description}</p>
            </div>
        );
    };
    


export {
    VideoDetails
};