import nodemailer from "nodemailer";

async function mailSender(email, title, body){
    try{
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            secure: false
        })

        const info = await transporter.sendMail({
            from: `"Learner's Academy <${process.env.MAIL_USER}>"`,
            to: `${email}`,
            subject: `${title}`, 
            html: `${body}`
        })
        console.log(info)
        return info;
    }
    catch(e){
        console.log(e.message);
        return e;
    }
}

export {
    mailSender
}