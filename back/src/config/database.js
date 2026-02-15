import mongoose from "mongoose"

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI) //waits for DB connection
        console.log("mongoDB CONNECTED!!")
    }
    catch(er){
        console.error("DB connection failed:", er.message)
        process.exit(1)
    }
}
export default connectDB