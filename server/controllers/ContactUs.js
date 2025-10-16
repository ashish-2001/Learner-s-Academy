import { z } from "zod";
import { mailSender } from "../utils/mailSender.js";
import { contactUsEmail } from "../mail/templates/contactFormResponse.js";


const contactUsControllerValidator = z.object({
    email: z.string().email("Invalid email address"),
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        message: z.string().min(1, "Message are required"),
        phoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be of 10 digits"),
        countryCode: z.string().regex(/^\+\d{1, 3}$/, "Country code is required")
}) 
async function contactUsController(req, res){

    try{
        const parsedResult = contactUsControllerValidator.safeParse(req.body);

        if(!parsedResult.success){
            return res.status(404).json({
                success: false,
                message: "Invalid input",
                errors: parsedResult.error.errors
            })
        }

        const { email, firstName, lastName, message, phoneNumber, countryCode } = parsedResult.data;

        await mailSender(
            email, 
            "Your Data send successfully",
            contactUsEmail(email, firstName, lastName, message, phoneNumber, countryCode)
        )
        
        return res.status(200).json({
            success: true,
            message: "Email send successfully"
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Something went wrong...",
            error: e.message
        })
    }
}

export { 
    contactUsController
}