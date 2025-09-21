import { z } from "zod";
import { Course } from "../models/Course.js";
import mongoose from "mongoose";
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
    try{
        const parsedResult = capturePaymentValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(404).json({
                success: false,
                message: "Invalid input",
                errors: parsedResult.error.errors
            })
        }

        const { courses } = parsedResult.data;
        const userId = req.user.id;

        let total_amount = 0;

        for(const course_id of courses){
            try{
                const course = await Course.findById(course_id)

                if(!course){
                    return res.status(404).json({
                        success: false,
                        message: " Could not find the course"
                    })
                }

                const uid = new mongoose.Types.ObjectId(userId);

                if(course.studentsEnrolled.includes(uid)){
                    return res.status(400).json({
                        success: false,
                        message: "Student is Already Enrolled"
                    })
                }

                total_amount += course.price;
            }
            catch(e){
                return res.status(500).json({
                    success: false,
                    message: e.message
                })
            }
        }

        const options = {
            amount : total_amount * 100,
            currency: "INR",
            receipt: Math.random(Date.now()).toString(),
        }

        const paymentResponse = await instance.orders.create(options);

        return res.status(200).json({
            success: true,
            data: paymentResponse
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Could not initiate order",
            error: e.message
        })
    }
}

const verifyPaymentValidator = z.object({
    razorpay_order_id: z.string().min(1, "Order id is required"),
    razorpay_payment_id: z.string().min(1, "Payment id is required"),
    razorpay_signature: z.string().min(1, "Signature is required"),
    courses: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course format")).min(1, "At least one course id is required")
})

async function verifyPayment(req, res){

    try{
        const parsedResult = verifyPaymentValidator.safeParse(req.body);
        if(!parsedResult.success){
            return res.status(404).json({
                success: true,
                message: "Invalid input",
                errors: parsedResult.error.errors
            })
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = parsedResult.data;

        const userId = req.user.id;

        let body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");

        if(expectedSignature === razorpay_signature) {
            await enrollStudents(courses, userId, res);
            return res.status(200).json({
                success: true,
                message: "Payment verified"
            })
        }

        return res.status(200).json({
            success: true,
            message: "payment verified"
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

const sendPaymentSuccessfulEmailValidator = z.object({
    orderId: z.string().min(1, "order id is required"),
    paymentId: z.string().min(1, "Payment id is required"),
    amount: z.number().positive("Amount must be greater than 0")
})

async function sendPaymentSuccessfulEmail(req, res){

    try{
            const parsedResult = sendPaymentSuccessfulEmailValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(404).json({
                success: false,
                message: "Payment not done"
            })
        }

        const { orderId, paymentId, amount } = parsedResult.data;

        const userId = req.user.id;

        const enrolledStudent = await User.findById(userId);

        await mailSender(
            enrolledStudent.email,
            `payment received`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount / 100,
                orderId,
                paymentId
            )
        )
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: e.message
        })
    }
}

const enrollStudentsValidator = z.object({
    courses: z.array(z.string().min(1, "course id cannot be empty"))
    .nonempty("At least one course must be provided"),
    userid: z.string().min(1, "user id is required")
})

async function enrollStudents(req, res){

    try{
        const { courses, userId } = enrollStudentsValidator.safeParse(req.body);

        for(const courseId of courses){
            try{
                const enrolledCourse = await Course.findOneAndUpdate({
                    _id: courseId
                }, {
                    $push: {
                        studentsEnrolled: userId
                    }
                }, {
                    new: true
                }) 

                if(!enrolledCourse){
                    return res.status(404).json({
                        success: false,
                        message: "Course not found"
                    })
                }

                const courseProgress = await CourseProgress.create({
                    courseId: courseId,
                    userId: userId,
                    completedVideos: []
                })

                const enrolledStudent = await User.findByIdAndUpdate(
                    userId,
                    {
                        $push: {
                            courses: courseId,
                            courseProgress: courseProgress._id
                        },
                    },
                    {
                        new: true
                    }
                )

                await mailSender(
                    enrolledStudent.email,
                    `Successfully Enrolled into ${enrolledCourse.courseName}`,
                    courseEnrollmentEmail(
                        enrolledCourse.courseName,
                        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
                    )
                )
            }
            catch(e){
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                    error: e.message
                })
            }

            return res.status(200).json({
                success: true,
                message: "User enrolled successfully in all selected courses"
            })
        }
    }
    catch(validationError){
        return res.status(400).json({
            success: false,
            errors: validationError.errors.map((err) => err.message)
        })
    }
}

export {
    capturePayment,
    verifyPayment,
    sendPaymentSuccessfulEmail,
    enrollStudents
}