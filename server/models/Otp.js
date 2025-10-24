import mongoose from "mongoose";
import { mailSender } from "../utils/mailSender.js";
import { otpTemplate } from "../mail/templates/emailVerificationTemplate.js";

const otpSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },

    accountType: {
        type: String,
        enum: ["Student", "Instructor"],
        required: true
    },
    
    otp: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5
    }
});

async function sendVerificationEmail(email, otp){

    try{
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            otpTemplate(otp)
        )
        console.log("Email sent successfully:-", mailResponse.response)
    }catch(e){
        console.log("Error occurred while sending email:-", e.message)
        throw new Error("Something went wrong")
    }
}

otpSchema.pre("save", async function (next){
    console.log("New document saved to the database")

    if(this.isNew){
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

const Otp = mongoose.model("Otp", otpSchema);

export {
    Otp
}