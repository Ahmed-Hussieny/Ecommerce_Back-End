import mongoose from "mongoose"

//^ connect to mongoDB from NodeJs
export const connection_DB = async ()=>{
    await mongoose.connect(process.env.CONNECTION_STRING)
    .then(()=>{
        console.log("Connected to MongoDB")
    }).catch((err)=>{
        console.log("Error connecting to MongoDB", err)
    })
}