
import express from "express";
import dotenv from "dotenv";
import "./tempconfig/dbConnection.js";  
import cors from "cors";
import bodyParser from "body-parser"; 
import http from "http";
import { Server } from "socket.io";
 
import userRouter from "./routes/userRoutes.js";
import socketHandler from "./tempconfig/socket.js";
import messagerouter from './routes/messageRouter.js'
dotenv.config();

const app = express();
 
app.use(bodyParser.json());
app.use(express.json());
const port = process.env.PORT || 5000;
app.use(cors({
  origin: [
    "https://chat-frontend-o3tv.vercel.app", 
    "https://chat-frontend-o3tv-git-main-vishal-sharmas-projects-ab23e010.vercel.app"
  ],
  credentials: true
}));

 
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

 
socketHandler(io);
app.get('/', (req, res) => {
  res.send('Chat API is running.');
});

 

 
app.use("/auth", userRouter);  
 
 app.use("/api" , messagerouter);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

 
 
 
 
 
 


