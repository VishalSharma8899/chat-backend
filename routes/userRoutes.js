import express from "express";
const router = express.Router();
 
import { userRegister, login ,getAllUsers } from "../controllers/userController.js";

router.post("/register", userRegister);
router.post("/login", login);
router.get('/users', getAllUsers); 
 

export default router;
