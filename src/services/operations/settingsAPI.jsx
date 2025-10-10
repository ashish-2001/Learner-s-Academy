import { toast } from "react-hot-toast";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { settingsEndpoints } from "../apis";
import { logout } from "./authAPI";

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API
} = settingsEndpoints;

async function updateDisplayPicture(token, formData){
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        try{
            const response = await apiConnector("PUT", UPDATE_DISPLAY_PICTURE_API, formData, {
                "Content-type": "multipart/form-data", 
                Authorization: `Bearer ${token}`
            })
            console.log("Update display picture api response...........", response)
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Display picture updated successfully")
            dispatch(setUser(response.data.data))
        }catch(error){
            console.log("update display picture api error", error)
            toast.error("Could not update display picture")
        }
        toast.dismiss(toastId)
    }
}

async function updateProfile(token, formData){
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
    
    try{
        const response = await apiConnector("POST", UPDATE_PROFILE_API, formData, {
            Authorization: `Bearer ${token}`
        })
        console.log("Update profile api response...........", response)
        if(!response.data.success){
            throw new Error(response.data.message)
        }

        const userData = response.data?.updatedUserDetails;

        const userImage = userData?.image 
        ? userData.image
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.firstName || "")}+${encodeURIComponent(userData?.lastName || "")}&background=random&size=128`
        dispatch(setUser({ ...userData, image: userImage}))
        toast.success("Profile updated successfully")
    }catch(error){
        console.log("Update profile api error..........", error)
        toast.error("Could not update profile")
    }
    toast.dismiss(toastId)
}
}

async function changePassword(token, formData){
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
            Authorization: `Bearer ${token}`
        })
        console.log("Change password api response........", response)
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("Password changed successfully")
    } catch(error){
        console.log("Change password api error..........", error)
        toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
}

async function deleteProfile(token, navigate){
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try{
            const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
                Authorization: `Bearer ${token}`
            })
            console.log("Delete profile api response", response)
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Profile deleted successfully")
            dispatch(logout(navigate))
        } catch(error){
            console.log("Delete profile api error", error)
            toast.error("Could not delete profile")
        }
        toast.dismiss(toastId)
    }
}

export {
    updateDisplayPicture,
    updateProfile,
    changePassword,
    deleteProfile
}