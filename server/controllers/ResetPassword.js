import { z } from "zod";
import { User } from "../models/Users";
import bcrypt from "bcrypt"
import { mailSender } from "../utils/MailSender";

const resetPasswordValidator = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format")
})

async function resetPasswordToken(req, res){
    try{
        const { email } = resetPasswordValidator.safeParse(req.body);

        const user = await User.findOne({
            email
        }) 

        if(!user){
            return res.status(404).json({
                success: false,
                message: `This email: ${email} is not registered with us.`
            })
        }

        const token = crypto.randomBytes(20).toString("hex");

        await User.findOneAndUpdate({
            email
        }, {
            token,
            resetPasswordExpires: Date.now() + 3600000
        }, {
            new: true
        })

        const url = `https://learner's-academy-project.vercel.app/upload`;

        await mailSender(
            email,
            "Password Reset",
            `Your link for password reset is ${url}. Please click this url to reset password`
        )

        return res.status(200).json({
            success: true,
            message: "Email sent successfully. Please check email inbox to continue"
        })
    }
    catch(e){
        if(e instanceof z.ZodError){
            return res.status(500).json({
                success: false,
                errors: e.errors.map((err) => err.message)
            })
        }

        return res.status(500).json({
            error: e.message,
            success: false,
            message: "Some error occurred while sending the reset email"
        })
    }
}

const resetPasswordValidator1 = z.object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
    token: z.string().min(1, "Token is required")
}).refine((data) => data.password === data.confirmPassword, {
    message: "password and confirm password do not match",
    path: ["confirmPassword"]
})

async function resetPassword(req, res){
    try{
        const { password, token } = resetPasswordValidator1.safeParse(req.body);

        const userDetails = await User.findOne({
            token
        })

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "Token is invalid"
            })
        }

        if(!(userDetails.resetPasswordExpires > Date.now())){
            return res.status(403).json({
                success: false,
                message: "Token is expired, please regenerate your token"
            })
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate({
            token
        }, {
            password: encryptedPassword
        }, {
            new: true
        })

        res.status(200).json({
            success: true,
            message: "Password reset successful"
        })
    }
    catch(e){
        return res.status(400).json({
            success: true,
            errors: e.errors.map((err) => err.message)
        })
    }

    return res.status(500).json({
        success: false,
        message: "Some error occurred while updating the password"
    })
}

export {
    resetPasswordToken,
    resetPassword
}