import { Request, Response } from "express";
import authModel from "../model/authModel";
import crypto from "crypto" 
import dotenv from "dotenv"
import jwt from "jsonwebtoken";


dotenv.config()




export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        const initial = name.charAt(0).toUpperCase()

        
        const code = crypto.randomInt(1000, 9999).toString();
        




        const user = await authModel.create({
            name,
            email,
            password,
            image: initial,
            verified: false,
            code
        })

        const tokenID = jwt.sign({ id: user?._id }, process.env.SECRET!)

        res.status(201).json({
            message: "user created sucessfully",
            Data: user,
            tokenID
        })
    } catch (error) {
        res.status(404).json({
            message: "error registering user",
            data: error
        })
    }
}






export const loginUser = async (req: Request, res: Response) => {
    try {
       
           const tokenID = req.params.token
        const verify: any = jwt.verify(tokenID, process.env.SECRET!)
     const id = verify.id
    const  User  = await authModel.findById(id)
    

        if (!User ) {
            return res.status(400).json({
             message: 'Invalid email or password' });
        }
        if (!User ) {
            return res.status(401).json({
             message: 'Account not verified' });
        }
      

        const login = jwt.sign(tokenID,process.env.SECRET!);
        if (login) {
            res.status(200).json({
             message: 'Login successful',
             
            
            });  
        }
       } catch (error) {
            res.status(404).json({
            message: "Error logging user",
            data: error
        })
        }

      }



        export const verifyUser = async (req: Request, res: Response) => {
            
            try {
                const tokenID = req.params.token
                const { code } = req.body



                if (!tokenID || !code) {
                    res.status(400).json({
                        message: `token and code required`
                    })
                }

                const verify: any = jwt.verify(tokenID, process.env.SECRET!)
                const User= verify.User
                const verifiedUser = await authModel.updateOne({_id: User },{ $set: { verified: true, token: " " } })

                if (!verifiedUser) {
                    res.status(400).json({
                        message: `verification failed`
                    })
                }
                res.status(200).json({
                    message: 'User verified successfully'
                });

            } catch (error) {
                res.status(404).json({
                    message: "Error verifying  user",
                    data: error
                })
            }

        }