import express, { Application, Request, Response } from "express"
import database from "./config/database"
import dotenv from "dotenv"
import authRouter from "./router/authRouter"

dotenv.config()
const port: number = parseInt(process.env.PORT!)


const app: Application = express()

database()
app.use(express.json())
app.use("/user", authRouter)

app.get("/", (req: Request, res: Response) => {
    try {
        res.status(200).json({
            message: `welcome to user story`
        })


    } catch (error) {
        res.status(500).json({
            message: `server error`
        })
    }
})
app.listen(port,() =>{
console.log(`server is running on port ${port}`);
})