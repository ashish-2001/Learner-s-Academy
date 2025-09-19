import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/Users";
import { Otp } from "../models/Otp";
import { Profile } from "../models/profile";


const JWT_SECRET = process.env.JWT_SECRET;

const signUpValidator = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
    contactNumber: z.number().regex(/^[0-9]{10}$/, "Contact number must be of 10 digits"),
    accountType: z.enum(["Student", "Instructor"]),
    otp: z.number().length(6, "Otp must be of 6 characters")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});


const signUp = async (req, res) =>{

    try{
        const result = signUpValidator.safeParse(req.body);

        if(!result.success){
            res.status(403).json({
                message: "Incorrect input",
                success: false
            })
        }

        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp} = result.data;

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp ){

            res.status(403).json({
                message: "All fields are required"
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

        if(response.length === 0){
            res.status(403).json({
                message: "Otp is not valid",
                success: false
            })
        } else if(otp !== response[0].otp){
            res.status(403).json({
                message: "Otp is not valid",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let approved = "";

        approved === "Instructor" ? (approved == false) : (approved == true);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            contactNumber: null,
            about: null
        });

        const user = await User.create({
            fistName: firstName,
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

        return req.status(200).json({
            message: "User registered successfully",
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

    try{
            const result = signInValidator.safeParse(req.body);
        
        if(!result.success){
            res.status(403).json({
                message: "Incorrect Input",
                success: false
            })
        }

        const { email, password } = result.data;

        const user = await User.findOne({
            email
        }).populate("additionalDetails");

        if(!user){
            res.status({
                message: "User does not exist! Signup first",
                success: false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch){
            res.status(403).json({
                message: "Incorrect email or password",
                success: false
            })
        }

        const token = jwt.sign({
            userId: user._id,
            role: user.role,
            email: user.email
        }, JWT_SECRET);

        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.cookie("token", token, options).status(200).json({
            token,
            user,
            success: true,
            message: "User login success"
        });
    }
    catch(e){
        console.error(e.message)
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }

};

const otpValidator = z.object({
    email: z.string().email("Invalid Email Address")
})

const sendOtp = async (req, res) => {

    try{
        const result1 = otpValidator.safeParse(req.body);

        if(!result1.success){
            return res.status({
                message: "Incorrect input",
                success: false
            })
        }

        const { email } = result1.data;

        const checkUserPresent = await User.findOne({
            email
        })

        if(checkUserPresent){
            res.status(403).json({
                message: "User already exists!",
                success: false
            })
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets:false,
            specialChars: false
        })

        const result = await Otp.findOne({ otp })

        console.log("Otp:-", otp);
        console.log("Result:-", result);

        while(result){
            otp: otpGenerator.generate(6, {
                upperCaseAlphabets: false
            })
        }

        const otpPayload = { email, otp };
        const otpBody = await Otp.create({ otpPayload });
        res.status(200).json({
            success: true,
            message: "Otp sent successfully",
            otp
        })

    }
    catch(e){
        console.error(e.message);
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
};

const changePassword = async (req, res) =>{

    try{
        const userDetails = await User.findById(req.user.userId);

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
                new: true
            }
        )

        try{
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Password for your account has been updated",
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            )
            console.log("Email sent successfully", emailResponse.response)
        }
        catch(e){

            return res.status(500).json({
                message: "Error occurred while sending email",
                success: false
            })
        }
    }
    catch(e){
        return res.status(500).json({
            message: "Error occurred while updating password",
            success: false
        })
    }
};


export {
    signUp,
    signIn,
    sendOtp,
    changePassword
}