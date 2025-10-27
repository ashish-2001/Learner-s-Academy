import { z } from "zod";
import { User } from "../models/Users.js";
import bcrypt from "bcrypt"
import { mailSender } from "../utils/mailSender.js";

async function resetPasswordToken(req, res){
    try{
        const email = req.body.email;
        const user = await User.findOne({
            email: email
        }) 

        if(!user){
            return res.status(404).json({
                success: false,
                message: `This email: ${email} is not registered with us.`
            })

        }

        const token = crypto.randomBytes(20).toString("hex");

        const updatedDetails = await User.findOneAndUpdate({
            email: email
        }, {
            token: token,
            resetPasswordExpires: Date.now() + 3600000
        }, {
            new: true
        });

        console.log("Details:", updatedDetails);

        const url = `http://localhost:3000/update-password/${token}`;

        await mailSender(
            email,
            "Password Reset",
            `Your Link for email verification is ${url}. Please click this url to reset password`
        )

        return res.status(200).json({
            success: true,
            message: "Email sent successfully. Please check email inbox to continue"
        })
    }
    catch(e){

        return res.status(500).json({
            error: e.message,
            success: false,
            message: "Some error occurred while sending the reset email"
        });

    }
}

const resetPasswordValidator1 = z.object({
        password: z.string().min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string().min(6, "Confirm password is required"),
        token: z.string().min(1, "Token is required")
    }).refine((data) => data.password === data.confirmPassword, {
    message: "password and confirm password do not match",
    path: ["confirmPassword"]
});

async function resetPassword(req, res){
    try{
        const { password, confirmPassword, token } = resetPasswordValidator1.safeParse(req.body);

        if(confirmPassword !== password){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm password does not match"
            })
        }

        const userDetails = await User.findOne({
            token: token
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
            token: token
        }, {
            password: encryptedPassword
        }, {
            new: true
        })

        return res.status(200).json({
            success: true,
            message: "Password reset successful"
        })
    }
    catch(e){
        return res.status(400).json({
            success: true,
            message: "Some error in updating the password",
            errors: e.errors.map((err) => err.message)
        })
    }
}

export {
    resetPasswordToken,
    resetPassword
}