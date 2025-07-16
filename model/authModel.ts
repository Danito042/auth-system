import mongoose, { Schema } from "mongoose"

interface User {
    name: string,
    email: string
    password: string,
    image: string,
    verified: boolean,
    code: string,
}

interface userData extends User, mongoose.Document {}

const  authModel  = new Schema({
    name: {
        type: String,
        required: [true, "Please input name"],
        unique: true

    },
    email: {
        type: String,
        required: [true, "pleas input email"]
    },
    password: {
        type: String

    },
    image: {
        type: String

    },
    verified: {
        type: Boolean,
         default : false,
         

    },
    code: {
        type: String,
       

    }


}, {timestamps: true})
export default mongoose.model<userData>("users", authModel)