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
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

async function BuyCourse(token, courses, userDetails, navigate, dispatch){
    const toastId = toast.loading("Please wait while we redirect you to payment gateway", {
        position: "bottom-center",
        autoClose: false
    });
    try{
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
        if(!res){
            toast.error("Razorpay SDK failed to load. Check your internet connection.")
            return;
        }

        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, {
            courses
        }, {
            Authorization: `Bearer ${token}`
        });

        if(!orderResponse.data.success){
            toast.error(orderResponse.data.message);
            console.log("buyCourse -> orderResponse", orderResponse);
            toast.dismiss(toastId);
            return;
        }
        console.log("buyCourse -> orderResponse", orderResponse);

        const options = {
            key: process.env.RAZORPAY_KEY,
            currency: orderResponse.data.currency,
            amount: orderResponse.data.amount.toString(),
            order_id: orderResponse.data.orderId,
            name: "Learners Academy",
            description: "Thanks for purchasing the course",
            image: rzp_logo,
            prefill: {
                name:` ${userDetails?.firsName}` + " " + `${userDetails?.lastName}`,
                email: userDetails?.email
            },
            handler: async function (response){
                console.log("buyCourse -> response", response);
                sendPaymentSuccessEmail(response, orderResponse.data.amount, token);
                verifyPayment(response, courses, token, navigate, dispatch)
            },
            theme: {
                color: "#686CFD"
            }
        }

        const paymentObject = new window.Razorpay(options);

        paymentObject.open();
        paymentObject.on("payment.failed", function (response){
            toast.error("Oops! Payment Failed.");
        });
        toast.dismiss(toastId);
    } catch(error){
        toast.dismiss(toastId);
        toast.console.error("Something went wrong");
        console.log("buyCourse -> error", error);
    }
}

async function verifyPayment(response, courses, token, navigate, dispatch){
    const toastId = toast.loading("Please wait while we verify your payment");
    console.log("Verify Payment -> courses", courses.courses);

    try{
        const res = await apiConnector("POST", COURSE_VERIFY_API, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            courses: courses.courses || courses
        }, {
            Authorization: `Bearer ${token}`
        });

        console.log("Verify Payment -> courses", res)
        if(!res.data.success){
            toast.error(response.message);
            return;
        }

        toast.success("Payment Successful. You are added to the course ")
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
    
        const res = await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            amount,
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
        }, {
            Authorization: `Bearer ${token}`
        })

        if(!res.success){
            console.log(res.message);
            toast.error(res.message);
        }
}

export {
    BuyCourse,
    verifyPayment,
    sendPaymentSuccessEmail
}