import mongoose from "mongoose";

export const connect = async () => { 
    
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log("Database connected!");
    }catch(e){
        console.log(e);
        process.exit(1);
    }
}
