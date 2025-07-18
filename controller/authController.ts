import { Request, Response } from "express";
import authModel from "../model/authModel";
import crypto from "crypto"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
dotenv.config()

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body
        // bring out intail as image 
        const initial = name.charAt(0).toUpperCase()
        // generating  code 
        const code = crypto.randomInt(1000, 9999).toString();
        // hashing password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const user = await authModel.create({
            name,
            email,
            password: hash,
            image: initial,
            verified: true,
            code
        })

        const tokenID = jwt.sign({ id: user?._id }, process.env.SECRET!)
        if (user) {
            res.status(201).json({
                message: `welcome ${user?.name}, you have sucessfully created an account`,
                Data: user,
                tokenID
            })
        } else {
            res.status(404).json({
                message: "Invalid registration",
            })
        }

    } catch (error) {
        res.status(404).json({
            message: "error registering user",
            data: error
        })
    }
}

export const verifyUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params // userID gotten from jwt in params while registering
        const { code } = req.body // code/token will be put it the body to verify also 
        if (id && code) {
            const User = await authModel.findByIdAndUpdate(id, { code }, { new: true })

            if (User) {
                res.status(200).json({
                    message: `welcome ${User?.name}, you have been successfully verified`
                });
            } else {
                res.status(400).json({
                    message: `verification failed`
                })
            }
        }
    } catch (error) {
        res.status(404).json({
            message: "Error verifying  user",
            data: error
        })
    }

}

// i had to put in ( verified : true), while registering 
// and i think thats why it was able to login
// cuz if i put in( verified : false),its gives me
// "User not verified &&  token not cleared" 
//  And i also  tired compromising  by deconstucting , but i think it was not needed
// const { code = " " } = req.params   
// console.log(code);                          
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await authModel.findOne({ email, });
        if (user) {
            const checked = (user?.verified === true && user?.code === " ")

            if (checked) {
                res.status(201).json({
                    message: "User verified && token  cleared"
                });
            }
        } else {
            res.status(401).json({
                message: "User not verified &&  token not cleared"
            });
        }
        if (user) {
            const checked = await bcrypt.compare(password, user?.password);
            if (checked) {
                res.status(201).json({
                    message: `Welcome ${user?.name}`,
                });
            } else {
                res.status(400).json({
                    message: "Password incorrect"
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error logging user",
            error
        });
    }
};