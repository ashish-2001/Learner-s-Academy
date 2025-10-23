import mongoose from "mongoose";



export const connect = () => { 
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Db Connection success"))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })
}
