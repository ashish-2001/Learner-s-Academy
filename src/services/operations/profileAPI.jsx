import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { profileEndpoints, settingsEndpoints } from "../apis";
import { logout } from "./authAPI";
import { setProgress } from "../../slices/loadingBarSlice";

async function getUserCourses(token, dispatch){
    dispatch(setProgress(50));
    let result = [];
    try{
        const response = await apiConnector("GET", profileEndpoints.GET_USER_ENROLLED_COURSES_API, null, {
            Authorization: `Bearer ${token}` 
        });
        if(!response.data.success){
            throw new Error(response.data.message);
        };
        result = response.data.data;
    } catch(error){
        toast.error("Could not get Enrolled courses", error.message);
    };
    dispatch(setProgress(100));
    return result;
};

async function getProfilePicture(token, profilePicture){
    const toastId = toast.loading("Loading...");
    try{
        const formData = new FormData();
        formData.append("displayPicture", profilePicture);

        const response = await apiConnector("PUT", settingsEndpoints.UPDATE_DISPLAY_PICTURE_API, formData, {
            Authorization: `Bearer ${token}` 
        });
        if(!response.data.success){
            throw new Error(response.data.message);
        };
        toast.success("Profile picture uploaded successfully");
        const imageUrl = response.data.data.image;
        localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user")), image: imageUrl }));
    } catch(error){
        toast.error(error?.response?.data?.message);
    };
    toast.dismiss(toastId);
};

async function updateAdditionalDetails(token, additionalDetails){

    const {
        firstName, 
        lastName,
        dateOfBirth,
        gender,
        contactNumber,
        about
    } = additionalDetails;

    const toastId = toast.loading("Updating Profile...");

    try{

        const response = await apiConnector("PUT", settingsEndpoints.UPDATE_PROFILE_API, { firstName, lastName, dateOfBirth, gender, contactNumber, about }, {
            Authorization: `Bearer ${token}` 
        });
        if(!response.data.success){
            throw new Error(response.data.message);
        };
        toast.success("Additional Details updated successfully");
        const user = JSON.parse(localStorage.getItem("user")) || {};
        const updatedUser = {
            ...user,
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            additionalDetails: {
                ...user.additionalDetails,
                dateOfBirth: dateOfBirth || user.additionalDetails?.dateOfBirth,
                contactNumber: contactNumber || user.additionalDetails?.contactNumber,
                about: about || user.additionalDetails?.about,
                gender: gender || user.additionalDetails?.gender
            }
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
    } catch(error){
        toast.error(error.response.data.message);
    } finally{
        toast.dismiss(toastId);
    };
};

async function updatePassword(token, password){
    const { oldPassword, newPassword, confirmPassword: confirmPassword } = password;
    
    const toastId = toast.loading("Updating Password...");

    try{
        const response = await apiConnector("PUT", settingsEndpoints.CHANGE_PASSWORD_API, { oldPassword, newPassword, confirmPassword }, {
            Authorization: `Bearer ${token}` 
        });
        if(!response.data.success){
            throw new Error(response.data.message);
        };
        toast.success("Password updated successfully");
    }catch(error){
        toast.error(error?.response?.data?.message);
    };
    toast.dismiss(toastId);
};

async function deleteAccount(token, dispatch, navigate){
    const toastId = toast.loading("Deleting Account...");
    try{
        const response = await apiConnector("DELETE", settingsEndpoints.DELETE_PROFILE_API, null, {
            Authorization: `Bearer ${token}` 
        });
        if(!response.data.success){
            throw new Error(response.data.message);
        };
        toast.success("Account Deleted successfully");
        dispatch(logout(navigate));
    } catch(error){
        toast.error(error?.response?.data?.message);
    } finally {
        toast.dismiss(toastId);
    };
};

async function getInstructorDashboard(token, dispatch){

    dispatch(setProgress(30));
    let result = [];

    try{
        const response = await apiConnector("GET", profileEndpoints.GET_ALL_INSTRUCTOR_DASHBOARD_DETAILS_API, null, {
            Authorization: `Bearer ${token}` 
        });
        if(!response.data.success){
            throw new Error(response.data.message);
        };
        result = response.data.data;
    }catch(error){
        toast.error(error?.response?.data?.message);
    } finally {
        dispatch(setProgress(100));
    };
    return result;
};

export {
    updateAdditionalDetails,
    getProfilePicture,
    updatePassword,
    getInstructorDashboard,
    getUserCourses,
    deleteAccount
};