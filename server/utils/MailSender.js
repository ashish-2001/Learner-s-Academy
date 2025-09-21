import { nodemailer } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

async function mailSender(email, title, body){
    try{
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            secure: false
        })

        let info = await transporter.sendMail({
            from: `"Learner's Academy "<${process.env.MAIL_USER}>`,
            to: `${email}`,
            subject: `${title}`, 
            html: `${body}`
        })
        console.log(info.response)
        return info
    }
    catch(e){
        return e.message
    }
}

export {
    mailSender
}