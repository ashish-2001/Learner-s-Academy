import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSWORD_API,
    RESETPASSTOKEN_API
} = endpoints

function sendOtp(email, navigate){

    return async (dispatch) => {
        const toastId = toast.loading("loading...")
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("POST", SENDOTP_API, {
                email,
                checkUserPresent: true
            })

            console.log("SENDOTP API RESPONSE........", response)
            console.log(response.data.success)

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("Otp sent successfully")
            navigate("/verify-email")
        } catch(error){
            console.log("SENDOTP API ERROR........", error)
            toast.error("Could not send otp")
        }

        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

function signUp(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading")
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("POST", SIGNUP_API, {
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp
            })

            console.log("SIGNUP API RESPONSE............", response)

            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Signup successfully")
            navigate("/login")
        } catch(error){
            console.log("SIGNUP API ERROR.........", error)
            toast.error("Signup Failed")
            navigate("/signup")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}


function login(email, password, navigate){
    return async (dispatch)=> {
        const toastId = toast.loading("Loading....")
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("POST", LOGIN_API, {
                email,
                password
            })

            console.log("LOGIN API RESPONSE..........", response)
            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("Login successful")
            dispatch(setToken(response.data.token))
            const userImage = response.data?.user?.image
            ? response.data.user.image
            : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
            dispatch(setUser({ ...response.data.user, image:userImage }))
            localStorage.setItem("token", JSON.stringify(response.data.token))
            navigate("/dashboard/my-profile")
        } catch(error){
            console.log("LOGIN API ERROR...........", error)
            toast.error("Login Failed")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

function getPasswordResetToken(email, setEmailSent){
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try{
            const response = await apiConnector("POST", RESETPASSTOKEN_API, {
                email
            })

            console.log("RESETPASSTOKEN RESPONSE............", response)

            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Reset Email Sent")
            setEmailSent(true)
        } catch(error){
            console.log("RESETPASSTOKEN ERROR............", error)
            toast.error("Failed to send reset email")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}

function resetPassword(password, confirmPassword, token, navigate){
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("POST", RESETPASSTOKEN_API, {
                password,
                confirmPassword,
                token
            })
            console.log("RESETPASSWORD RESPONSE........", response)
            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("Password Reset Successfully")
            navigate("/login")
        }catch(error){
            console.log("RESETPASSWORD ERROR..........", error)
            toast.error("Failed to reset password")
        }

        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}

function logout(navigate){
    return (dispatch) => {
        dispatch(setToken(null))
        dispatch(setUser(null))
        dispatch(resetCart())
        localStorage.removeItem("item")
        localStorage.removeItem("user")
        toast.success("Logged Out")
        navigate("/")
    }
}


export {
    signUp,
    login,
    sendOtp,
    getPasswordResetToken,
    resetPassword,
    logout
}