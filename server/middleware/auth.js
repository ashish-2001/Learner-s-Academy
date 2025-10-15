import { z } from "zod";
import jwt from "jsonwebtoken";
import { User } from "../models/Users.js";
import dotenv from "dotenv";

dotenv.config();

const authValidator = z.object({
    token: z.string().min(1, "Token cannot be empty").optional()
})

async function auth(req, res, next){
    try{

        let token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "") || null ;

        try{
            const parsedResult = authValidator.safeParse({ token });
            if(parsedResult.success){
                token = parsedResult.data.token
            }
        }
        catch(e){
            if(e instanceof z.ZodError){
                return res.status(400).json({
                    success: false,
                    errors:e.errors.map((err) => err.message)
                })
            }
        }

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode
        }
        catch(e){
            return res.status(401).json({
                success: false, 
                message: "Token is invalid",
                error: e.message
            })
        }

        next();
    }
    catch(e){
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token",
            error: e.message
        })
    }
}


const studentValidator = z.object({
    email: z.string().email("Invalid email format")
})

async function isStudent(req, res, next){
    try{
            const parsedResult = studentValidator.safeParse(req.user);

            if(!parsedResult.success){
                return res.status(400).json({
                    success: false,
                    errors: parsedResult.error.errors.map(err => err.message)
                })
            }

        const userDetails = await User.findOne({
            email: parsedResult.data.email
        })

        if(!userDetails || userDetails.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students"
            })
        }

        next();
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "User role can't be verified",
            error: e.message
        })
    }

    return res.status(500).json({
        success: false,
        message: "User role can't be verified"
    })
}

const adminValidator = z.object({
    email: z.string().email("Invalid email format")
})

async function isAdmin(req, res, next){
    try{
        const parsedResult = adminValidator.safeParse(req.user);

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                errors: parsedResult.error.errors.map(err => err.message)
            })
        }

        const userDetails = await User.findOne({
            email: parsedResult.data.email
        })

        if(!userDetails || userDetails.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin"
            })
        }

        next();
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "Admin role can't be verified",
            error: e.message
        })
    }
}

const instructorValidator = z.object({
    email: z.string().email("Invalid email format")
});

async function isInstructor(req, res, next){
    try{
        const parsedResult = instructorValidator.safeParse(req.user);

        if(!parsedResult.success){
            return res.status(400).json({
                success: false,
                errors: parsedResult.error.errors.map(err => err.message)
            })
        }
        const userDetails = await User.findOne({
            email: parsedResult.data.email
        })

        if(!userDetails || userDetails.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructor"
            })
        }

        next()
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "instructor role can't be verified",
            error: e.message
        })
    }
}


export { 
    auth,
    isStudent,
    isAdmin,
    isInstructor
}