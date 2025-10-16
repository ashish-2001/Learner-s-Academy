import { success, z } from "zod";
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
        const userId = req.user.userId;

        if(courses.length === 0){
            return res.status(404).json({
                message: "Please provide course id"
            })
        }

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

                if(course.studentsEnroled.includes(uid)){
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
                        studentsEnroled: userId
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

                console.log("Enrolled student: ", enrollStudents)

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