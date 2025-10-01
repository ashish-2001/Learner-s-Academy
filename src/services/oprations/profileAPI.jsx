import toast from "react-hot-toast";
import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../apis";
import { logout } from "./authAPI";

const {
    GET_USER_DETAILS_API,
    GET_USER_ENROLLED_COURSES_API,
    GET_INSTRUCTOR_DATA_API
} = profileEndpoints;

function getUserDetails(token ,navigate){
    return async (dispatch) =>{
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
                Authorization: `Bearer${token}`
            })
            console.log("get user details api response......", response)
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            const userImage = response.data.data.image
            ? response.data.data.image
            : `https://api.dicebar.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
            dispatch(setUser({...response.data.data, image: userImage}))
        } catch(error){
            dispatch(logout(navigate))
            console.log("Get user details api error.....", error)
            toast.error("Could not get user details")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    } 
}


async function getUserEnrolledCourses(token){
    const toastId = toast.loading("Loading...")
    let result = [];
    try{
        const response = await apiConnector("GET", GET_USER_ENROLLED_COURSES_API, null, {
            Authorization: `Bearer ${token}`
        })
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        result = response.data.data
    } catch(error){
        console.log("Get user Enrolled courses api error", error)
        toast.error("Could not get enrolled courses")
    }
    toast.dismiss(toastId)
    return result
}

async function getInstructorData(token){
    const toastId = toast.loading("Loading...");
    let result = [];
    try{
        const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
            Authorization: `Bearer ${token}`
        })
        console.log("Get instructor data api response........", response)
        result = response?.data?.courses
    } catch(error){
        console.log("Get instructor data api error.........", error)
        toast.error("Could not get instructor data")
    }
    toast.dismiss(toastId)
    return result
}

export {
    getUserDetails,
    getUserEnrolledCourses,
    getInstructorData
}