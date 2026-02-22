import { toast } from "react-hot-toast";
import { setProgress } from "../../slices/loadingBarSlice";
import { apiConnector } from "../apiConnector";
import { courseEndpoints } from "../apis";

const { 
    COURSE_DETAILS_API,
    COURSE_CATEGORIES_API,
    CREATE_CATEGORY_API,
    GET_ALL_COURSE_API,
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    CREATE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_SECTION_API,
    DELETE_SUBSECTION_API,
    GET_ALL_INSTRUCTOR_COURSES_API,
    DELETE_COURSE_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED,
    CREATE_RATING_API,
    LECTURE_COMPLETION_API,
    ADD_COURSE_TO_CATEGORY_API,
    SEARCH_COURSES_API
} = courseEndpoints;

async function getAllCourses(){

    const toastId = toast.loading("Loading...");
    let result = [];

    try{
        const response = await apiConnector("GET", GET_ALL_COURSE_API);
        if(!response?.data?.success){
            throw new Error("Could not fetch course categories");
        }
        result = response?.data?.data;
    }
    catch(error){
        toast.error(error.message);
    };
    toast.dismiss(toastId);
    return result;
};

async function fetchCourseDetails(courseId, dispatch){
    
    dispatch(setProgress(50));
    let result = null;

    try{
        const response = await apiConnector("GET", `${COURSE_DETAILS_API}?courseId=${courseId}`);
        if(!response?.data?.success){
            throw new Error(response.data.message || "Failed to fetch course details");
        };
        result = response.data.data;
    } catch(error){
        result = error.response.data;
    };
    dispatch(setProgress(100));
    return result;
};

async function fetchCourseCategories(){
    let result = [];
    try{
        const response = await apiConnector("GET", COURSE_CATEGORIES_API)
        if(!response?.data?.success){
            throw new Error("Could not fetch course categories");
        }
        result = response?.data?.data;
    } catch(error){
        toast.error(error?.response?.data?.message);
    };
    return result;
};

async function addCourseDetails(data, token){
    const toastId = toast.loading("Loading...");
    let result = null;
    try{
        const response = await apiConnector("POST", CREATE_COURSE_API, data, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        }
    );
    if(!response?.data?.success){
        throw new Error(response?.data?.message || "Could Not Add Course Details")
    };
    toast.success("Course Details Added Successfully")
    result = response?.data?.data;
    } catch(error){
        console.log("CREATE COURSE API ERROR...........", error)
        toast.error(error.response?.data?.message);
    } finally{
        toast.dismiss(toastId);
    };
    return result;
}


async function editCourseDetails(data, token){
    let result = null;
    const toastId = toast.loading("Loading...");

    try{
        const response = await apiConnector("POST", EDIT_COURSE_API, data, {
                "Content-type": "multipart/form-data",
                Authorization:`Bearer ${token}`
            });
            if(!response?.data?.success){
                throw new Error(response?.data?.message || "Could not update course details")
            }
            toast.success("Course details updated successfully")
            result = response?.data?.data
    } catch(error){
        console.log("EDIT COURSE API ERROR........", error)
        toast.error(error.response.data.message)
    } finally{
        toast.dismiss(toastId)
    }
    return result;
}

async function createSection(data, token){
    let result = null;
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiConnector("POST", CREATE_SECTION_API, data, 
            {
                "Content-type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        );
        if(!response?.data?.success){
            throw new Error("Could not create section");
        };
        toast.success("Course Section created");
        result = response?.data?.updatedCourse;
    }catch(error){
        toast.error(error?.response?.data?.message || error.message || "Failed to create section");
    } finally {
        toast.dismiss(toastId);
    };
    return result;
};

async function createSubSection(data, token){
    let result = null;
    const toastId = toast.loading("Uploading...");
    try{
        const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, 
            {
                "Content-type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        );
        if(!response?.data?.success){
            throw new Error(response?.data?.message || "Could not add lecture");
        };
        toast.success("Lecture added");
        result = response?.data?.data;
    }catch(error){
        toast.error(error?.response?.data?.message || error.message || "Failed to create sub-section");
    } finally{
        toast.dismiss(toastId);
    }
    return result;
};

async function updateSection(data, token){
    let result = null;
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiConnector("PUT", UPDATE_SECTION_API, data, 
        {
            "Content-type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        });
        if(!response?.data?.success){
            throw new Error("Could not update section")
        };
        toast.success("Course section updated");
        result = response?.data?.updatedCourse;
    } catch(error){
        toast.error(error?.response?.data?.message || error.message || "Failed to update section");
    } finally{
        toast.dismiss(toastId);
    }
    return result;
};

async function updateSubSection(data, token){
    let result = null;
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, 
        {   "Content-type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        });
        if(!response?.data?.success){
            throw new Error("Could not update lecture")
        };
        toast.success("Lecture updated");
        result = response?.data?.data;
    } catch(error){
        toast.error(error?.response?.data?.message || error.message || "Failed to update sub-section");
    } finally{
        toast.dismiss(toastId);
    };
    return result;
};

async function deleteSection(data, token){
    let result = null;
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiConnector("POST", DELETE_SECTION_API, data, 
            {
                "Content-type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        );
        if(!response?.data?.success){
            throw new Error("Could not delete section");
        };
        toast.success("Course section deleted");
        result = response?.data?.updatedCourse;
    } catch(error){
        toast.error(error?.response?.data?.message || error.message || "Failed to delete section");
    } finally {
        toast.dismiss(toastId);
    };
    return result;
};

async function deleteSubSection(data, token){
    let result = null;
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, 
            {
                "Content-type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        ); 
        if(!response?.data?.success){
            throw new Error("Could not delete lecture")
        };
        toast.success("Lecture deleted");
        result = response?.data?.data;
    } catch(error){
        toast.error(error?.response?.data?.message || error.message || "Failed to delete sub-section");
    } finally{
        toast.dismiss(toastId);
    };
    return result;
};

async function fetchInstructorCourses(token){
    let result = [];
    const toastId = toast.loading("Loading");
    try{
        const response = await apiConnector("GET", GET_ALL_INSTRUCTOR_COURSES_API, null, 
            {
                Authorization: `Bearer ${token}`
            }
        );
        if(!response?.data?.success){
            throw new Error("Could not fetch instructor courses");
        };
        result = response?.data?.data;
    } catch(error){
        toast.error(error?.response?.data?.message || error.message || "Failed to fetch instructor courses");
    } finally{
        toast.dismiss(toastId)
    };
    return result;
};

async function deleteCourse(data, token){
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiConnector("DELETE", DELETE_COURSE_API, data, 
            {
                Authorization: `Bearer ${token}`
            }
        );
        if(!response?.data?.success){
            throw new Error("Could not delete course");
        };
        toast.success("Course deleted");
    } catch(error){
        toast.error(error?.response?.data?.message || error.message || "Failed to delete course");
    } finally{
        toast.dismiss(toastId)
    };
};

async function getFullDetailsOfCourse(courseId, token){
    const toastId = toast.loading("Loading...");
    let result = null;
    try{
        const response = await apiConnector("GET", `${GET_FULL_COURSE_DETAILS_AUTHENTICATED}?courseId=${courseId}`, null, 
            {
                Authorization: `Bearer ${token}`
            }
        );
        if(!response?.data?.success){
            throw new Error(response.data.message);
        };
        result = response?.data?.data;
    } catch(error){
        toast.error(error?.response?.data?.message || error.message || "Failed to get details of the course");
    } finally{
        toast.dismiss(toastId);
    };
    return result;
};

async function markLectureAsCompleted(data, token){
    let result = null;
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, 
            {
                Authorization: `Bearer ${token}`
            }
        );
        if(!response?.data.message){
            throw new Error(response.data.error);
        };
        toast.success("Lecture Completed");
        result = true;
    } catch(error){
        toast.error(error?.response?.data?.message || error.message || "Failed to mark as complete");
    } finally{
        toast.dismiss(toastId);
    };
    return result;
};

async function createRating(data, token){
    const toastId = toast.loading("Loading...");
    let success = false;

    try{
        const response = await apiConnector("POST", CREATE_RATING_API, data, 
            {
                Authorization: `Bearer ${token}`
            }
        );
        if(!response?.data?.success){
            throw new Error("Could not create rating");
        };
        toast.success("Rating Created");
        success = true;
    } catch(error){
        success = false;
        toast.error(error?.response?.data?.message || error.message || "Failed to create rating");
    } finally{
        toast.dismiss(toastId);
    };
    return success;
};

async function addCourseToCategory(data, token){

    const toastId = toast.loading("Loading...");
    let success = false;

    try{    
        const response = await apiConnector("POST", ADD_COURSE_TO_CATEGORY_API, data, 
            {
                Authorization: `Bearer ${token}`
            }
        );
        if(!response?.data?.message){
            throw new Error("Could add course to category");
        };
        toast.success("Course added to category");
        success = true;
    } catch(error){
        toast.error(error?.response?.data?.message || error.message || "Failed to add course category");
    } finally{
        toast.dismiss(toastId);
    };
    return success;
};

async function searchCourses(searchQuery, dispatch){

    dispatch(setProgress(50));
    let result = null;

    try{
        const response = await apiConnector("POST", SEARCH_COURSES_API, {
            searchQuery
        });
        if(!response?.data?.success){
            throw new Error("Could not search courses");
        };
        result = response.data.data;
    } catch(error){
        toast.error(error?.response?.data?.message || error.message || "Failed to search courses");
        return []
    } finally{
        dispatch(setProgress(100));
    };
    return result;
};

async function createCategory(data, token){

    const toastId = toast.loading("Creating Category...");

    try{
        const response = await apiConnector("POST", CREATE_CATEGORY_API, data, 
            {
                Authorization: `Bearer ${token}`
            }
    );
        if(!response?.data?.success){
            throw new Error(response?.data?.message);
        }
        return response.data;
    } catch(error){
        toast.error(error?.response?.data?.message || error.message || "Failed to create")
    } finally {
        toast.dismiss(toastId);
    };
};


export {
    getAllCourses,
    fetchCourseDetails,
    fetchCourseCategories,
    addCourseDetails,
    createSection,
    editCourseDetails,
    createSubSection,
    updateSection,
    updateSubSection,
    markLectureAsCompleted,
    getFullDetailsOfCourse,
    deleteCourse,
    fetchInstructorCourses,
    deleteSection,
    deleteSubSection,
    createRating,
    addCourseToCategory,
    searchCourses,
    createCategory
};
