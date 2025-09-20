import mongoose from "mongoose";
const { MONGODB_URL } = process.env;

function connect(){
    mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("Bd Connection success"))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    })
}

export {
    connect
}