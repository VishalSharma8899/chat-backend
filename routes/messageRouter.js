import express from "express";
const messagerouter = express.Router();
 import { messageSend , messageget } from "../controllers/messageController.js";
 import {auth} from "../middleware/auth.js"

messagerouter.post("/messagesend", messageSend);
messagerouter.get("/get/:_id", auth , messageget);

 

export default messagerouter;
