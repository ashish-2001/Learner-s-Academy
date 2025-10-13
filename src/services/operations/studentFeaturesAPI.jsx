import { toast } from "react-hot-toast";
import { rzp_logo } from "../../assets/logo";
import { resetCart } from "../../slices/cartSlice";
import { setPaymentLoading } from "../../slices/courseSlice";
import { apiConnector } from "../apiConnector";
import { studentEndpoints } from "../apis";


const { 
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API
} = studentEndpoints;


function loadScript(src){
    return new Promise ((resolve) => {
        const script = document.createElement("script")
        script.src = src
        script.onLoad = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

async function BuyCourse(token, courses, user_details, navigate, dispatch){
    const toastId = toast.loading("Loading...")
    try{
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
        if(!res){
            toast.error("Razorpay SDK failed to load. Check your internet connection.")
            return
        }

        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, {
            courses
        }, {
            authorization: `Bearer ${token}`
        })

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message)
        }
        console.log("Payment response from backend............", orderResponse.data)

        const options = {
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id: orderResponse.data.data.id,
            name: "Learners Academy",
            description: "Thanks for purchasing the course",
            image: rzp_logo,
            prefill: {
                name: `${user_details.firsName} ${user_details.lastName}`,
                email: user_details.email
            },
            handler: function (response){
                SEND_PAYMENT_SUCCESS_EMAIL_API(response, orderResponse.data.data.amount, token)
                verifyPayment({ ...response, courses }, token, navigate, dispatch)
            }
        }
        const paymentObject = new window.Razorpay(options)

        paymentObject.open()
        paymentObject.on("payment.failed", function (response){
            toast.error("Oops! Payment Failed.")
            console.log(response.error)
        })
    } catch(error){
        console.log("Payment api error..........", error)
        toast.error("Could not make payment.")
    }
    toast.dismiss(toastId)
}

async function verifyPayment(bodyData, token, navigate, dispatch){
    const toastId = toast.loading("Verifying Payment...")
    dispatch(setPaymentLoading(true))
    try{
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            authorization: `Bearer ${token}`
        })
        console.log("Verify payment response from backend...........", response)
        if(!response.data.success){
            throw new Error(response.data.message)
        }

        toast.success("Payment successfull. You are added to the course ")
        navigate("/dashboard/enrolled-courses")
        dispatch(resetCart())
    }catch(error){
        console.log("Payment verify error............", error)
        toast.error("Could ot verify payment.")
    }
    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false))
}

async function sendPaymentSuccessEmail(response, amount, token){
    try{
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount
        }, {
            authorization: `Bearer ${token}`
        })
    } catch(error){
        console.log("Payment success email error.............", error)
    }
}

export {
    BuyCourse,
    verifyPayment,
    sendPaymentSuccessEmail
}