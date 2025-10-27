import { success, z } from "zod";
import { Course } from "../models/Course.js";
import mongoose, { mongo } from "mongoose";
import { CourseProgress } from "../models/CourseProgress.js";
import { User } from "../models/Users.js";
import { mailSender } from "../utils/mailSender.js";
import { courseEnrollmentEmail } from "../mail/templates/CourseEnrollmentEmail.js";
import { paymentSuccessEmail } from "../mail/templates/paymentSuccessEmail.js";
import { instance } from "../config/razorpay.js";


const capturePaymentValidator = z.object({
    courses: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course Id format")).min(1, "at least one course id is required")
})


async function capturePayment(req, res) {
    
    const { courses } = req.body;
    const userId = req.user.userId;

    try{
        if(courses.length === 0){
            return res.status(404).json({
                success: false,
                message: "Please provide the valid course id"
            });
        };

        let totalAmount = 0;

        for(const course_id of courses){
            let course;

            try{
                course = await Course.findById(course_id);
                if(!course){
                    return res.status(404).json({
                        success: false,
                        message: "Could not find the course"
                    })
                }

                const uid = new mongoose.Types.ObjectId(userId);
                if(course.studentsEnrolled.includes(uid)){
                    return res.status(200).json({
                        success: false,
                        message: "Student is already enrolled"
                    });
                };
                totalAmount += course.price;
            }
            catch(error){
                return res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }

        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: Math.random(Date.now()).toString()
        };

        try{
            const paymentResponse = await instance.orders.create(options);

            return res.status(200).json({
                success: true,
                orderId: paymentResponse.id,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount
            })
        } catch(error){
            return res.status(500).json({
                success: true,
                message: error.message
            })
        }
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


async function verifyPayment(req, res){

    try{

        const razorpay_order_id = req.body?.razorpay_order_id
        const razorpay_payment_id = req.body?.razorpay_payment_id;
        const razorpay_signature = req.body?.razorpay_signature
        const courses = req.body?.courses;

        const userId = req.user.userId;

        if(!razorpay_order_id || !razorpay_payment_id || razorpay_signature || !courses || userId){
            return res.status(404).json({
                success: false,
                message: "Payment Failed"
            })
        }

        let body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");

        if(expectedSignature === razorpay_signature) {
            await enrollStudents(courses, userId, res);
            return res.status(200).json({
                success: true,
                message: "Payment verified"
            })
        }

        return res.status(403).json({
            success: true,
            message: "Payment Failed"
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: e.message
        })
    }
}

async function sendPaymentSuccessfulEmail(req, res){

    try{

        const { orderId, paymentId, amount } = req.body;

        const userId = req.user.id;

        if(!orderId || !paymentId || !amount || !userId){
            return res.status(400).json({
                success: false,
                message: "Please provide all the details"
            })
        }

        try{
            const enrolledStudent = await User.findById(userId);

            await mailSender(
                enrolledStudent.email,
                `Payment Received`,
                paymentSuccessEmail(
                    `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                    amount / 100,
                    orderId,
                    paymentId
                )
            )
        }catch(error){
            console.log("Error in sending email:", error);
            return res.status(400).json({
                success: false,
                message: "Could not send email"
            })
        }
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: e.message
        })
    }
}

export {
    capturePayment,
    verifyPayment,
    sendPaymentSuccessfulEmail
}