import mongoose, { Schema } from "mongoose"

interface user {
    name: string,
    email: string
    password: string,
    image: string,
    verified: boolean,
    code: string,
}

interface userData extends user, mongoose.Document {}

const  authModel  = new Schema({
    name: {
        type: String,
        required: [true, "Please input name"],
        unique: true

    },
    email: {
         type:String,
        required:true,
        trim:true,
        toLowerCase:true,
        match: [
            /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
            "Please fill a valid email address",
          ],
          unique:true

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