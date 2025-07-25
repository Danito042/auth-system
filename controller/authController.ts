import { Request, Response } from "express";
import authModel from "../model/authModel";
import crypto from "crypto"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import cloudinary from "../config/cloudinary";

dotenv.config()

export const registerUser1 = async (req: Request, res: Response) => {
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
            verified: false,
            code
        })

        const tokenID = jwt.sign({ id: user?._id }, process.env.SECRET!)
        res.status(201).json({
            message: `welcome ${user?.name}, you have sucessfully created an account`,
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

export const verifyUser = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { code } = req.body
        const verified: any = jwt.verify(token, process.env.SECRET!)
        const id = verified.id  //person's  id gotten from jwt in params
        if (verified) {
            const checked = await authModel.findById(id);
            if (checked) {
                const user = await authModel.findByIdAndUpdate(id, { code: " ", verified: true }, { new: true });
                if (user) {
                    res.status(200).json({
                        message: `Welcome ${user.name}, you have been successfully verified`,

                    });
                } else {
                    res.status(404).json({
                        message: `not successfully verified`,
                    })
                }
            } else {
                res.status(404).json({
                    message: "User not found"
                });
            }
        } else {
            res.status(401).json({
                message: "Failed to check"
            });
        }
    } catch (error: any) {
        res.status(404).json({
            message: "Error verifying user",
            data: error
        });
    }
}


export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await authModel.findOne({ email });

        if (user) {
            const checked = await bcrypt.compare(password, user.password);
            if (checked) {

                if (user.verified === true && user.code === " ") {
                    res.status(201).json({
                        message: `Welcome ${user.name}`,
                    });
                } else {
                    res.status(401).json({
                        message: "Please go and verify your account.",
                    });
                }
            } else {
                res.status(401).json({
                    message: "Incorrect password.",
                });
            }
        } else {
            res.status(401).json({
                message: "User not found. Please register.",
            });
        }

    } catch (error) {
        res.status(404).json({
            message: "Error logging user",
            error
        })
    }
};


export const registerUser = async (req: any, res: Response) => {
    try {
        const { name, email, password } = req.body
        const { secure_url } = await cloudinary.uploader.upload(req?.file.path);
        const image = secure_url
        // generating  code 
        const code = crypto.randomInt(1000, 9999).toString();
        // hashing password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const user = await authModel.create({
            name,
            email,
            password: hash,
            image,
            verified: false,
            code
        })

        const tokenID = jwt.sign({ id: user?._id }, process.env.SECRET!)
        res.status(201).json({
            message: `welcome ${user?.name}, you have sucessfully created an account`,
            Data: user,
            tokenID
        })
    } catch (error) {
        console.log("registrring error", error);

        res.status(404).json({
            message: "error registering user",
            data: error
        })
    }
}

