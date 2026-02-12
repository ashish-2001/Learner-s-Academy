import { z } from "zod";
import mailSender from "../utils/mailSender.js";


const contactUsValidator = z.object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    message: z.string().min(1, "Message are required"),
    contactNumber: z.string().regex(/^[0-9+\s]{8,15}$/, "Contact number must be of 10 digits"),
    countryCode: z.string().min(1, "Country code is required")
});

async function contactUs(req, res){

    try{
        const parsedResult = contactUsValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                errors: parsedResult.error.errors
            })
        }

        const { email, firstName, lastName, message, contactNumber, countryCode } = parsedResult.data;

        const data = {
            firstName,
            lastName,
            email,
            message,
            contactNumber,
            countryCode
        }

        const info = await mailSender(
            email, 
            "Your message has been received",
            `<html><body>${Object.keys(data).map((key) => {
                return `<p>${key} : ${data[key]}</p>`;
            })}</body></html>`
        )
        
        if(info){
            return res.status(200).json({
                success: true,
                message: "Email send successfully"
            })
        } else{
            return res.status(403).json({
                success: true,
                message: "Email could not be send!"
            });
        }
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: e.message
        })
    }
}

export { 
    contactUs
}