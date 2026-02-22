import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

async function auth(req, res, next){

    try{
        let token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "") || req.body.token;
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is Missing"
            });
        };
        try{  
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("decode", decode);
            req.user = decode;

        } catch(e){
            return res.status(401).json({
                success: false,
                message: ("Token is invalid", e.message)
            });
        };
        next();
    } catch(e){
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token",
            error: e.message
        });
    };
};

async function isStudent(req, res, next){
    try{
        if(req.user.accountType !== "Student"){
            return res.status(403).json({
                success: false,
                message: "This is a protected route for students only"
            });
        };
        next();
    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Students role can't be verified",
            error: e.message
        });
    };
};


async function isInstructor(req, res, next){
    try{
        
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructor only"
            });
        };
        next();
    } catch(e){
        return res.status(500).json({
            success: false,
            message: "instructor role can't be verified",
            error: e.message
        });
    };
};

async function isAdmin(req, res, next){
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin ony"
            });
        };
        next();
    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Admin role can't be verified",
            error: e.message
        });
    };
};


export { 
    auth,
    isStudent,
    isAdmin,
    isInstructor
};