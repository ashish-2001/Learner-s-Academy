import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { profileEndpoints, settingsEndpoints } from "../apis";
import { logout } from "./authAPI";
import { setProgress } from "../../slices/loadingBarSlice";

async function getUserCourses(token, dispatch){
        dispatch(setProgress(50));
        let result = [];
        try{
            console.log("BEFORE CALLING BACKEND API FOR ENROLLED COURSES");
            const response = await apiConnector("GET", profileEndpoints.GET_USER_ENROLLED_COURSES_API, null, {
               headers: { Authorization: `Bearer ${token}` }
            });

            console.log("AFTER CALLING BACKEND API FOR ENROLLED COURSES");

            if(!response.data.success){
                throw new Error(response.data.message);
            }
            result = response.data.data;
        } catch(error){
            console.log("Get user details api error.....", error)
            toast.error("Could not get Enrolled courses");
        }
        dispatch(setProgress(100));
        return result;
}

async function getProfilePicture(token, profilePicture){
    const toastId = toast.loading("Loading...");
    try{
        const formData = new FormData();
        console.log("Profile picture:", profilePicture);
        formData.append("displayPicture", profilePicture);

        const response = await apiConnector("PUT", settingsEndpoints.UPDATE_DISPLAY_PICTURE_API, formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("UPDATE DISPLAY PICTURE API RESPONSE.............", response);
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Profile picture uploaded successfully");
        const imageUrl = response.data.data.image;
        localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user")), image: imageUrl }));
        console.log(JSON.parse(localStorage.getItem("user")).image);
    } catch(error){
        console.log("UPDATE DISPLAY PICTURE API ERROR.................", error);
        toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
}

async function updateAdditionalDetails(token, additionalDetails){

    console.log("Additional details", additionalDetails);

    const {
        firstName, 
        lastName,
        dateOfBirth,
        gender,
        contactNumber,
        about
    } = additionalDetails;

    console.log("Additional details:", additionalDetails);

    const toastId = toast.loading("Loading...");

    try{
        const response = await apiConnector("PUT", settingsEndpoints.UPDATE_PROFILE_API, { firstName, lastName, dateOfBirth, gender, contactNumber, about }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        console.log("UPDATE ADDITIONAL DETAILS API RESPONSE...............", response)
        
        if(!response.data.success){
            throw new Error(response.data.message);
        }

        toast.success("Additional Details updated successfully");

        const user = JSON.parse(localStorage.getItem("user"));
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.additionalDetails.dateOfBirth = dateOfBirth || user.additionalDetails.dateOfBirth;
        user.additionalDetails.contactNumber = contactNumber || user.additionalDetails.contactNumber;
        user.additionalDetails.about = about || user.additionalDetails.about;
        user.additionalDetails.gender = gender;
        localStorage.setItem("user", JSON.stringify(user));

    } catch(error){
        console.log("UPDATE ADDITIONAL DETAILS API ERROR...............", error);
        toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
}

async function updatePassword(token, password){
    const { oldPassword, newPassword, confirmPassword: confirmPassword } = password;
    console.log("password", password);
    const toastId = toast.loading("Updating...");

    try{
        const response = await apiConnector("PUT", settingsEndpoints.CHANGE_PASSWORD_API, {oldPassword, newPassword, confirmPassword}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("UPDATE PASSWORD API RESPONSE...............", response);
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Password updated successfully");
    }catch(error){
        console.log("UPDATE PASSWORD API ERROR..............", error);
        toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
}

async function deleteAccount(token, dispatch, navigate){
    const toastId = toast.loading("Deleting...");
    try{
        const response = await apiConnector("DELETE", settingsEndpoints.DELETE_PROFILE_API, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("DELETE ACCOUNT API RESPONSE..............", response);
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Account Deleted successfully");
        dispatch(logout(navigate));
    } catch(error){
        console.log("DELETE ACCOUNT API ERROR.................", error);
        toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
}

async function getInstructorDashboard(token, dispatch){
        dispatch(setProgress(0));
        let result = [];
        try{
            console.log("BEFORE CALLING BACKEND API FOR INSTRUCTOR DASHBOARD");
            const response = await apiConnector("GET", profileEndpoints.GET_ALL_INSTRUCTOR_DASHBOARD_DETAILS_API, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("AFTER CALLING BACKEND API FOR INSTRUCTOR DASHBOARD");

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            result = response.data.data;
            console.log(result);
        }catch(error){
            console.log("GET INSTRUCTOR DASHBOARD API ERROR................", error);
            toast.error("Could Not Get Instructor Dashboard");
        }
        dispatch(setProgress(100));
        return result;
    }

export {
    updateAdditionalDetails,
    getProfilePicture,
    updatePassword,
    getInstructorDashboard,
    getUserCourses,
    deleteAccount
}