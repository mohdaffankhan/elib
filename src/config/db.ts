import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async ()=>{
    try {
        mongoose.connection.on("connected", () => {
            console.log("Database is connected");
        })
    
        mongoose.connection.on("error", (err) => {
            console.log("Error in connecting to database", err);
        })
    
        await mongoose.connect((config.mongo_url as string) + "/elib");
    } catch (error) {
        console.log("Failed to connect database", error);
        process.exit(1);
    }
}

export default connectDB