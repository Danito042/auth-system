import { Router } from  "express"; 
import{ upload } from "../config/multer"


import  { registerUser , loginUser, verifyUser} from "../controller/authController"
const router = Router();

router.route("/register").post(upload ,registerUser)
router.route("/verify/:token").patch(verifyUser)  
router.route("/login").post(loginUser)

export default router;