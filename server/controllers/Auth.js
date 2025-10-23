import {  z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/Users.js";
import { Otp } from "../models/Otp.js";
import { Profile } from "../models/Profile.js";
import otpGenerator from "otp-generator";
import { passwordUpdate } from "../mail/templates/PasswordUpdate.js";
import { mailSender } from "../utils/mailSender.js";

const JWT_SECRET = process.env.JWT_SECRET;

const signUpValidator = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
    accountType: z.enum(["Student", "Instructor"]),
    otp: z.string().length(6, "Otp must be digits")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});


const signUp = async (req, res) =>{

    try{
        const parsedResult = signUpValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(403).json({
                message: "Incorrect input",
                success: false
            })
        }

        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp} = parsedResult.data;

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm password do not match. Please try again"
            })
        }

        const existingUser = await User.findOne({
            email
        });

        if(existingUser){
            return res.status(411).json({
                message: "User already exists",
                success: false
            })
        }

        const response = await Otp.find({email}).sort({createdAt: -1}).limit(1);
        console.log(response);
        if(response.length === 0 || otp !== response[0].otp){
            return res.status(403).json({
                message: "Invalid otp",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let approved = "";
        approved === "Instructor" ? ( approved = false) : ( approved = true)

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        });

        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            contactNumber: contactNumber,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image: ""
        })

        const userId = user._id;

        const token = jwt.sign({
            userId
        }, JWT_SECRET)

        return res.status(200).json({
            message: "User registered successfully",
            user,
            token,
            success: true
        })
    }
    catch(e){
        console.error(e)
        return res.status(500).json({
            message: "User not registered! Please try again",
            success: false
        })
    }

}

const signInValidator = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
})

const signIn = async(req, res) => {

    
            const result = signInValidator.safeParse(req.body);
        
        if(!result.success){
            return res.status(403).json({
                message: "All the fields are required",
                success: false
            })
        }

        const { email, password } = result.data;

        const user = await User.findOne({
            email
        }).populate("additionalDetails");

        if(!user){
            return res.status(404).json({
                message: "User does not exist! Signup first",
                success: false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(isPasswordMatch){
            const token = jwt.sign({
            userId: user._id,
            role: user.role,
            email: user.email
        }, JWT_SECRET, {
            expiresIn: "24h"
        });

        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        return res.cookie("token", token, options).status(200).json({
            token,
            user,
            success: true,
            message: "User login success"
        });
    } else{
        return res.status(401).json({
            success: false,
            message: "Password is incorrect"
        })
    }
}



const otpValidator = z.object({
    email: z.string().email("Invalid Email Address")
})

const sendOtp = async (req, res) => {

    try{
        const result1 = otpValidator.safeParse(req.body);

        if(!result1.success){
            return res.status(400).json({
                message: "Input field is required",
                success: false
            })
        }

        const { email } = result1.data;

        const checkUserPresent = await User.findOne({
            email
        })

        if(checkUserPresent){
            return res.status(401).json({
                message: "User already exists!",
                success: false
            })
        }

        await Otp.deleteMany({ email });

        let otp;
        let otpExists;

        do { otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets:false,
                specialChars: false
            });
            otpExists = await Otp.findOne({ otp });
        } while(otpExists);

        await Otp.create({ email, otp });

        await mailSender(
            email,
            "Your Otp for Signup",
            `Hello! Your Otp for Signup is: ${otp}. It will expire in 10 minutes.`
        )

        return res.status(200).json({
            success: true,
            message: "Otp sent successfully",
            otp
        })
            
        }catch(e){
            console.error(e);
            return res.status(500).json({
                success: false,
                message: e.message
            })
        }

    }

const changePassword = async (req, res) =>{

    try{
        const userDetails = await User.findById(req.user.userId);

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const { oldPassword, newPassword } = req.body;

        const isPasswordMatch = await bcrypt.compare(
            oldPassword, 
            userDetails.password
        )

        if(!isPasswordMatch){
            return res.status(403).json({
                message: "Old password does not match",
                success: false
            })
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.userId,
            {
                password: encryptedPassword,
            }, 
            {
                new: true
            }
        )

        try{
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Password for your account has been updated",
                passwordUpdate(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            )
            console.log("Email sent successfully", emailResponse.response)
        }
        catch(e){
            console.error(e)
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email"
            })
            }

            return res.status(200).json({
                success: true,
                message: "Password updated successfully"
            })
    }
    catch(e){
        console.error(e);
        return res.status(500).json({
            message: "Error occurred while updating password",
            success: false,
            error: e.message
        })
    }
};


export {
    signUp,
    signIn,
    sendOtp,
    changePassword
}