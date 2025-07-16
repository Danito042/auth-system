import mongoose from  "mongoose"
import dotenv from "dotenv"

dotenv.config()


const database = async () =>{
   try{
    const db = await mongoose.connect(process.env.URL!);
    console.log(`connected to mogosDB at ${db.connection.host}`);
   }catch (error) {
   console.error("mongoDB connection failed", error);
   }  
};

export default database;