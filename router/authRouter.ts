import { Router } from  "express";


import  { registerUser , loginUser, verifyUser} from "../controller/authController"
const router = Router();

router.route("/register").post(registerUser)
router.route("/verify/:id").patch(verifyUser)  
router.route("/login").post(loginUser)

export default router;