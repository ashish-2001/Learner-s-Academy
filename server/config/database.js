import mongoose from "mongoose";


function connect(){
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Bd Connection success"))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })
}

export {
    connect
}