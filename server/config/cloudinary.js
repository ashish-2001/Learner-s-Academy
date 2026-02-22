import { v2 as cloudinary } from "cloudinary";

function cloudinaryConnect(){
    try{
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        });
        console.log("Connected to Cloudinary");
    }
    catch(e){
        console.log(e);
    };
};

export {
    cloudinaryConnect
};


